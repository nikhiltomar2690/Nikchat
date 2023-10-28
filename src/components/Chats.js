import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Chats = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  console.log(user);

  const handleLogout = async () => {
    await auth.signOut();
    history.push("/");
  };

  const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();

    return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
  };

  useEffect(() => {
    if (!user) {
      history.push("/");
      return;
    }

    // fetching current user to get their chats
    axios
      .get("https://api.chatengine.io/users/me/", {
        headers: {
          "project-id": "82fe4b2b-f40d-420b-ba1e-ca1bc0d62c0a",
          "user-name": user.email,
          "user-secret": user.uid,
        },
      })
      .then(() => {
        // display the chat for an existing profile on chatengine
        setLoading(false);
      })
      .catch(() => {
        // if no profile then we create on ChatEngine to display chats
        let formdata = new FormData();
        formdata.append("email", user.email);
        formdata.append("username", user.email);
        formdata.append("secret", user.uid);
        getFile(user.photoURL).then((avatar) => {
          formdata.append("avatar", avatar, avatar.name);

          axios
            .post("https://api.chatengine.io/users/", formdata, {
              headers: {
                "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY,
              },
            })
            .then(() => {
              setLoading(false);
            })
            .catch((error) => console.log(error.response.data));
        });
      });
  }, [user, history]);

  if (!user || loading) return "Loading...";

  return (
    <div className="chats-page">
      <div className="nav-bar">
        <div className="logo-tab">NikChat</div>
        <div className="logout-tab" onClick={handleLogout}>
          Logout
        </div>
      </div>

      <div style={{ fontFamily: "Montserrat" }}>
        <ChatEngine
          height="calc(100vh-66px)"
          projectID={process.env.REACT_APP_CHAT_ENGINE_ID}
          userName={user.email}
          userSecret={user.uid}
          fontFamily="Montserrat"
        />
      </div>
    </div>
  );
};

export default Chats;
