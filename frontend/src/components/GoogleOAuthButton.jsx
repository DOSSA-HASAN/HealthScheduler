import React, { useEffect } from 'react'

function GoogleOAuthButton({ onSuccess }) {
    useEffect(() => {
        if (window.google) {
            google.accounts.id.initialize({
                client_id: '634096214756-c9a9cojoj7re6iq7m2tj701d5r7ouoar.apps.googleusercontent.com',
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
