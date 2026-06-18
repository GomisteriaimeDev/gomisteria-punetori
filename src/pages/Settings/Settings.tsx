import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./Settings.scss";
import BlueButton from "../../components/BlueButton/BlueButton";
import FormInput from "../../components/FormInput/FormInput";
import OutlineButton from "../../components/OutlineButton/OutlineButton";
import { useAuth } from "../../context/AuthContext";
import Dashboard from "../../layouts/Dashboard";
import defaultUser from "../../assets/svg/defaultUser.svg";

type FormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  idPunetorit: string;
  nrPersonal: string;
  password: string;
  image: File | null;
};

const Settings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser, updateUser } = useAuth();

  const [formValues, setFormValues] = useState<FormValues>({
    fullName: "",
    email: "",
    phoneNumber: "",
    idPunetorit: "",
    nrPersonal: "",
    password: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  useEffect(() => {
    if (!currentUser) return;

    const sf = currentUser.specialFields || {};

    const fullName = sf.fullName || "";
    const email = currentUser.email || "";
    const phoneNumber = sf.phoneNumber || sf.phone || "";
    const idPunetorit = sf.idPunetorit || "";
    const nrPersonal = sf.nrPersonal || "";

    const currentImage =
      currentUser.Image && currentUser.Image.length > 0
        ? currentUser.Image[0].url
        : "";

    setFormValues({
      fullName,
      email,
      phoneNumber,
      idPunetorit,
      nrPersonal,
      password: "",
      image: null,
    });

    setImagePreview(currentImage);
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setFormValues((prev) => ({
      ...prev,
      image: file,
    }));
    setImagePreview(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const specialFields = {
      fullName: formValues.fullName,
      phoneNumber: formValues.phoneNumber,
      idPunetorit: formValues.idPunetorit,
      nrPersonal: formValues.nrPersonal,
    };

    const hasNewFile = !!formValues.image;

    if (hasNewFile) {
      const formData = new FormData();
      formData.append("email", formValues.email);
      if (formValues.password) {
        formData.append("password", formValues.password);
      }
      formData.append("specialFields", JSON.stringify(specialFields));
      formData.append("image", formValues.image as File);

      await updateUser(formData);
    } else {
      const payload: any = {
        email: formValues.email,
        specialFields,
      };
      if (formValues.password) {
        payload.password = formValues.password;
      }

      await updateUser(payload);
    }

    setIsEditing(false);
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  return (
    <Dashboard pageTitle={"Settings"}>
      <div>
        <div className="account-wrapper">
          <div className="account-information">
            <h2>Informacionet e llogarisë</h2>
            <div className="account-details-wrapper">
              <div className="account-main">
                <div className="account-image">
                  <img
                    className="account-image"
                    src={imagePreview || defaultUser}
                    alt={formValues.fullName || "User"}
                  />
                </div>
                <BlueButton onClick={toggleEdit}>Ndrysho informatat</BlueButton>
              </div>

              {/* VIEW MODE */}
              {!isEditing ? (
                <div className="account-details">
                  <div className="account-field">
                    <h6>Emri i plotë</h6>
                    <p>{currentUser?.specialFields?.fullName}</p>
                  </div>
                  <div className="account-field">
                    <h6>Email</h6>
                    <p>{currentUser?.email}</p>
                  </div>
                  <div className="account-field">
                    <h6>Telefoni</h6>
                    <p>{currentUser?.specialFields?.phoneNumber}</p>
                  </div>
                  <div className="account-field">
                    <h6>ID e Punëtorit</h6>
                    <p>{currentUser?.specialFields?.idPunetorit}</p>
                  </div>
                  <div className="account-field">
                    <h6>Numri Personal</h6>
                    <p>{currentUser?.specialFields?.nrPersonal}</p>
                  </div>
                </div>
              ) : (
                // EDIT MODE
                <div className="account-update-form">
                  <form className="account-update-form" onSubmit={handleSubmit}>
                    <div className="account-form-group">
                      <label htmlFor="fullName">Emri i plotë</label>
                      <FormInput
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formValues.fullName}
                        onChange={handleChange}
                        placeholder="Emri i Ri"
                      />
                    </div>

                    <div className="account-form-group">
                      <label htmlFor="email">Email</label>
                      <FormInput
                        type="email"
                        id="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        placeholder="Email i Ri"
                      />
                    </div>

                    <div className="account-form-group">
                      <label htmlFor="phoneNumber">Telefoni</label>
                      <FormInput
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formValues.phoneNumber}
                        onChange={handleChange}
                        placeholder="Numri i Ri i Telefonit"
                      />
                    </div>

                    <div className="account-form-group">
                      <label htmlFor="idPunetorit">ID e Punëtorit</label>
                      <FormInput
                        type="text"
                        id="idPunetorit"
                        name="idPunetorit"
                        value={formValues.idPunetorit}
                        onChange={handleChange}
                        placeholder="ID e Punëtorit"
                      />
                    </div>

                    <div className="account-form-group">
                      <label htmlFor="nrPersonal">Numri Personal</label>
                      <FormInput
                        type="text"
                        id="nrPersonal"
                        name="nrPersonal"
                        value={formValues.nrPersonal}
                        onChange={handleChange}
                        placeholder="Numri Personal"
                      />
                    </div>

                    <div className="account-form-group">
                      <label htmlFor="password">Fjalëkalimi i ri</label>
                      <FormInput
                        type="password"
                        id="password"
                        name="password"
                        value={formValues.password}
                        onChange={handleChange}
                        placeholder="Lëre bosh nëse nuk dëshiron ta ndryshosh"
                      />
                    </div>

                    <div className="account-form-group">
                      <label htmlFor="image">Foto e profilit</label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <label htmlFor="image" className="customFileInput">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt={formValues.fullName || "Preview"}
                            className="uploaded-preview"
                          />
                        ) : (
                          <p>Zgjidh imazh</p>
                        )}
                      </label>
                    </div>

                    <div className="account-update-buttons">
                      <BlueButton type="submit">Ruaj Ndryshimet</BlueButton>
                      <OutlineButton
                        type="button"
                        onClick={() => setIsEditing(false)}
                      >
                        Anulo
                      </OutlineButton>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Settings;
