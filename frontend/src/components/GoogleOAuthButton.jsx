import React, { useEffect } from 'react'

function GoogleOAuthButton({ onSuccess }) {
    useEffect(() => {
        if (window.google) {
            google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCallbackResponse,
            });

            google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                { theme: "outline", size: "large" }
            );
        }
    }, []);

    const handleCallbackResponse = (response) => {
        // Send this JWT to your backend
        onSuccess(response.credential);
    };

    return <div id="googleSignInDiv" />;
}

export default GoogleOAuthButton
