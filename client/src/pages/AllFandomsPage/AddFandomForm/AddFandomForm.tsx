import { FandomForm } from "../FandomForm/FandomForm";

interface AddFandomFormProps {
  gameId?: number;
  onCancel: () => void;
  onSuccess: (fandomId: number) => void;
}

export const AddFandomForm = ({
  gameId,
  onCancel,
  onSuccess,
}: AddFandomFormProps) => {
  return <FandomForm gameId={gameId} onCancel={onCancel} onSuccess={onSuccess} />;
