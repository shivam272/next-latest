export const Accordion = () => {
  return (
    <div>
      <div className="collapse bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-1" defaultChecked />
        <div className="collapse-title font-semibold">dummy question 1</div>
        <div className="collapse-content text-sm">dummy answer 1</div>
      </div>
      <div className="collapse bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title font-semibold">dummy question 2</div>
        <div className="collapse-content text-sm">dummy answer 2</div>
      </div>
      <div className="collapse bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title font-semibold">dummy question 3</div>
        <div className="collapse-content text-sm">dummy answer 3</div>
      </div>
    </div>
  );
};
