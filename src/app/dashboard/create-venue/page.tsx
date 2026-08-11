import { VenueForm } from "@/components";

export const dynamic = "force-dynamic";

const CreateVenuePage: React.FC = () => {
  return (
    <div>
      <div className="my-3">
        <VenueForm />
      </div>
    </div>
  );
};

export default CreateVenuePage;
