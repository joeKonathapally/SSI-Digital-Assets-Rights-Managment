import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import { createInvitation } from "../../helper/connection/createInvitation";

const Home = ({ name, api_url, hook_url = "" }) => {
  const [invite, setinvite] = useState(undefined);
  const [inviteUrl, setinviteUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      let local_invite = await createInvitation(api_url, "public", true, true);
      console.log(local_invite);
      setinvite(local_invite.invitation);
      setinviteUrl(local_invite.invitation_url);
      console.log(api_url);
    }
    fetchData();
  }, []);

  return (
    <>
      <h1>Welcome to the {name}'s public invitation page</h1>
      <p>
        This is the first point of trust within our system; anyone connecting
        with {name} can trust that this is their official web-page.
      </p>
      <QRCode value={inviteUrl} size={400} />
      <p>{JSON.stringify(invite)}</p>
    </>
  );
};

export default Home;
