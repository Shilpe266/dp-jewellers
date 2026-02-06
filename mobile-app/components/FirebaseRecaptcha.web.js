import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../lib/firebase';

const FirebaseRecaptcha = forwardRef(({ firebaseConfig, onVerify, onError }, ref) => {
  const verifierRef = useRef(null);

  useEffect(() => {
    try {
      verifierRef.current = new RecaptchaVerifier(auth, 'firebase-recaptcha-container', {
        size: 'invisible',
      });
      verifierRef.current.render().catch((err) => {
        console.warn('[FirebaseRecaptcha] Render warning:', err);
      });
    } catch (err) {
      console.error('[FirebaseRecaptcha] Init error:', err);
      if (onError) onError(err);
    }

    return () => {
      if (verifierRef.current) {
        try { verifierRef.current.clear(); } catch (e) {}
        verifierRef.current = null;
      }
    };
  }, []);

  // Expose sendOtp(phoneNumber) → Promise<verificationId>
  // Uses the real RecaptchaVerifier instance so Firebase recognizes it
  // and handles both v2 and Enterprise reCAPTCHA properly.
  useImperativeHandle(ref, () => ({
    sendOtp: async (phoneNumber) => {
      if (!verifierRef.current) {
        throw new Error('RecaptchaVerifier not initialized');
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifierRef.current);
      return confirmationResult.verificationId;
    },
  }));

  return <View nativeID="firebase-recaptcha-container" />;
});

export default FirebaseRecaptcha;
