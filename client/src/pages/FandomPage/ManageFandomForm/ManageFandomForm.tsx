import { FandomForm } from "../../AllFandomsPage/FandomForm/FandomForm";

interface ManageFandomFormProps {
  fandomId: number;
  onCancel: () => void;
  onSuccess: (fandomId: number) => void;
}

export const ManageFandomForm = ({ fandomId, onCancel, onSuccess }: ManageFandomFormProps) => {
  return <FandomForm fandomId={fandomId} onCancel={onCancel} onSuccess={onSuccess} />;

export default ManageFandomForm;
