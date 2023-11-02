import UserCreationForm from "@/components/UserCreationCard/UserCreationForm";
import Card from "@/components//Card";

const UserCreationCard = () => {
  return (
    <Card className="max-w-[600px] w-[400px] m-auto">
      <h1 className="font-bold text-center mb-4">Create User Profile</h1>
      <UserCreationForm />
    </Card>
  );
};

export default UserCreationCard;
