import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import CategoriesManagement from "../../components/CategoriesManagement/CategoriesManagement";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types/enums/Roles";
import styles from "./FandomServiceManagement.module.scss";

const FandomServiceManagement: FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === Role.Admin;

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [authLoading, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <div className={styles.loading}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <div className={styles.content}>
          <div className={styles.error}>
            <h3>Access Denied</h3>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header onSearch={() => {}} />
      <main className={styles.content}>
        <CategoriesManagement />
      </main>
    </div>
  );
};

export default FandomServiceManagement;
