const { NewPersonDialog } = require("@/modules/ai-report/ui/components/new-person-dialog");
const { PersonForm } = require("@/modules/ai-report/ui/components/person-form");

const Page = () => {
  return <div>
    <NewPersonDialog open={true} onOpenChange={() => {}} />
  </div>;
}