import { Avatar } from "../../../components/UI/Avatar/Avatar";
import styles from "./ProfileCard.module.scss";

type ProfileCardProps = {
  name: string;
  image: string | undefined;
}

export const ProfileCard = ({ name, image }: ProfileCardProps) => {
  return (
    <div className={styles.card}>
      <Avatar src={image} alt={name} size="large" className={styles.image} />
      <h4>{name}</h4>
    </div>
  );
};
