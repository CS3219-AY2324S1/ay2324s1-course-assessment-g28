import UserCreationForm from "@/components/UserCreationCard/UserCreationForm";
import Card from "@/components//Card";

const UserCreationCard = () => {
  return (
    <div className="flex-grow flex flex-col justify-center">
      <div className="flex flex-row justify-center">
      <Card className="max-w-[600px] flex-grow">
        <h1 className="font-bold text-center mb-4">Create User Profile</h1>
        <UserCreationForm />
      </Card>
      </div>
      
    </div>
  );
};

export default UserCreationCard;
