import { useEffect, useState, useContext } from 'react';
import config from './config';
import './Profile.css';
import UserContext from './context/userContext';
import { getEmployee, uploadEmployeePicture } from './services/employeeService';

import { Store } from 'react-notifications-component';

// const  test = {"id":1,"firstName":"John","lastName":"Doe",
// "email":"john.doe@example.com","phone":"123-456-7890","grade":"A",
// "role":"Developer","username":"johndoe","pfpUrl":"https://i.stack.imgur.com/34AD2.jpg"}

const ProfileImage = ({ pfpUrl, userId }) => {
  /**
   * @param {string} pfpUrl url for the profile picture
   * @param {number} userId the id of the current user
   */
  const [theImage, setImage] = useState(null);
  useEffect(() => {
    setImage(pfpUrl);
  }, []);

  return (
    <div className="PictureAndButton">
      <img src={theImage} className="photo" alt="no photo" />
      <UploadImage
        onChangeImage={setImage}
        selectedFile={theImage}
        userId={userId}
        pfpUrl={pfpUrl}
      />
    </div>
  );
};

const ConfirmPictureModal =({onOpenClose, visibility})=>{

  
}

const UploadImage = ({ onChangeImage, userId, pfpUrl }) => {
  /**
   * @param {CallableFunction} onChangeImage sets the selected image to display on screen
   * @param {number} userId the current users ID
   */
  const [newImage, setNewImage] = useState(null);
  const [imgUploadButton, setUpLoadButton] =useState(false);
  const [displayModal,setDisplayModal] = useState(false);
  const onImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      event.preventDefault();
      // const resizedImage = await resizeImage(event.target.files[0])
      onChangeImage(URL.createObjectURL(event.target.files[0]));
      setNewImage(event.target.files[0]);
      setUpLoadButton(true)
      
    } else {
      setUpLoadButton(false)
      onChangeImage(pfpUrl);
      setNewImage(null);
    }
  };

  const upload = async () => {
    const response = await uploadEmployeePicture(userId, newImage);
    setUpLoadButton(false)
    console.log(response);
    setDisplayModal(true);
    Store.addNotification({
      title: "Profile Updated",
      message: "The Profile Picture has been changed",
      type: "success",
      insert: "top-center",
      container: "top-center",
      animationIn: ["animateanimated", "animatefadeIn"],
      animationOut: ["animateanimated", "animatefadeOut"],
      dismiss: {
       duration: 5000,
      showIcon:true}})
      
  };

  return (
    <div className="showPicture">
      <input
        className="custom-file-upload "
        type="file"
        name="picture"
        accept="image/*"
        onChange={onImageChange}
        label="avatarFile_input"
      />
      {imgUploadButton ? (
        <button className="profileButton" type="submit" onClick={upload}>
          Upload
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

const UserInfo = ({ FullName, role, email, phone }) => {
  /**
   * @param {string} FullName The first and last name of the user
   * @param {string} Role the job/role of the current user
   *  @param {string} Email the users email address
   * @param {string} phone the phone number of the users
   */
  return (
    <div className="UserInfo">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        <p style={{ fontSize: 24 }}>
          Role:
          <span style={{ fontSize: 20, marginLeft: 5 }}>{role}</span>
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        <p style={{ fontSize: 24 }}>
          Email:
          <span style={{ fontSize: 20, marginLeft: 5 }}>{email}</span>
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        <p style={{ fontSize: 24 }}>
          Phone:
          <span style={{ fontSize: 20, marginLeft: 5 }}>{phone}</span>
        </p>
      </div>

      <br />
    </div>
  );
};

function Profile() {
  /**
   * the main component for the profile page
   */
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function my() {
      const m = await getEmployee(userId);
      setUser(m);
    }
    my();
  }, []);

  return (
    <div className="Profile" id="Profile">
      {user ? (
        <div className="hasUser">
          <div className="PictureAndName">
            <p className="UserName">{user.firstName + ' ' + user.lastName}</p>
            <ProfileImage pfpUrl={user.pfpUrl} userId={userId} />
          </div>

          <UserInfo
            FullName={user.firstName + ' ' + user.lastName}
            role={user.role}
            email={user.email}
            phone={user.phone}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Profile;
