import styles from "./ProfileCard.module.scss";

interface ProfileCredentialsProps {
  name: string;
  image: string | undefined;
}

export const ProfileCredentials = ({ name, image }: ProfileCredentialsProps) => {
  return (
    <div className={styles.card}>
      <img className={styles.image} src={image}></img>
      <h4 className={styles.name}>{name}</h4>
    </div>
  );
};
