import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const FirebaseRecaptcha = forwardRef(({ firebaseConfig, onVerify, onError }, ref) => {
  const [visible, setVisible] = useState(false);
  const [resolveToken, setResolveToken] = useState(null);
  const [rejectToken, setRejectToken] = useState(null);
  const webViewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    // Implements ApplicationVerifier interface for Firebase
    type: 'recaptcha',
    verify: () => {
      return new Promise((resolve, reject) => {
        setResolveToken(() => resolve);
        setRejectToken(() => reject);
        setVisible(true);
      });
    },
  }));

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'verify' && data.token) {
        setVisible(false);
        if (resolveToken) resolveToken(data.token);
        if (onVerify) onVerify(data.token);
      } else if (data.type === 'error') {
        setVisible(false);
        const error = new Error(data.message || 'reCAPTCHA verification failed');
        if (rejectToken) rejectToken(error);
        if (onError) onError(error);
      }
    } catch (e) {
      // Ignore non-JSON messages
    }
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://www.google.com/recaptcha/api.js?render=explicit"></script>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: rgba(0,0,0,0.3);
    }
    #recaptcha-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div id="recaptcha-container"></div>
  <script>
    function onRecaptchaLoad() {
      grecaptcha.render('recaptcha-container', {
        sitekey: '${firebaseConfig?.apiKey ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}',
        callback: function(token) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'verify', token: token }));
        },
        'error-callback': function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: 'reCAPTCHA error' }));
        },
        'expired-callback': function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: 'reCAPTCHA expired' }));
        }
      });
    }

    if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
      onRecaptchaLoad();
    } else {
      window.onload = onRecaptchaLoad;
    }
  </script>
</body>
</html>
`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={styles.container}>
        <View style={styles.webviewContainer}>
          <WebView
            ref={webViewRef}
            source={{ html }}
            onMessage={handleMessage}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            renderLoading={() => <ActivityIndicator size="large" color="#000" style={styles.loader} />}
            style={styles.webview}
          />
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewContainer: {
    width: 320,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
});

export default FirebaseRecaptcha;
