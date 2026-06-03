import { ArrowRight, CheckCircle2 } from "lucide-react";

type UnsupportedContact = {
  name: string;
  email: string;
};

type UnsupportedFieldSlideProps = {
  contact: UnsupportedContact;
  error?: string;
  isCollecting: boolean;
  isSubmitted: boolean;
  selectedField?: string;
  onStartContact: () => void;
  onChange: (key: keyof UnsupportedContact, value: string) => void;
  onSubmit: () => void;
};

export function UnsupportedFieldSlide({
  contact,
  error,
  isCollecting,
  isSubmitted,
  selectedField,
  onStartContact,
  onChange,
  onSubmit
}: UnsupportedFieldSlideProps) {
  if (isSubmitted) {
    return (
      <div className="question-slide unsupported-field-slide">
        <CheckCircle2 className="unsupported-field-slide__icon" size={46} />
        <h1>We have received your details and will be in touch.</h1>
      </div>
    );
  }

  return (
    <div className="question-slide unsupported-field-slide">
      <p className="eyebrow">Support update</p>
      <h1>We are not ready to support this field yet.</h1>
      <p className="question-copy">
        We currently do not have the level of expertise to support Civil service / Public service and Government office employees
        and are working to serve you in the near future.
      </p>
      <p className="question-copy">
        You can leave your contact details and we will be in touch with you when we are ready.
      </p>
      {selectedField ? <p className="unsupported-field-slide__selection">Selected field: {selectedField}</p> : null}

      {!isCollecting ? (
        <button className="primary-button" type="button" onClick={onStartContact}>
          Contact me when ready <ArrowRight size={18} />
        </button>
      ) : (
        <form
          className="unsupported-field-slide__form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="text-field">
            <span>Name</span>
            <input
              name="name"
              value={contact.name}
              onChange={(event) => onChange("name", event.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="text-field">
            <span>Email</span>
            <input
              name="email"
              value={contact.email}
              onChange={(event) => onChange("email", event.target.value)}
              type="email"
              autoComplete="email"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" type="submit">
            Submit details <ArrowRight size={18} />
          </button>
        </form>
      )}
    </div>
  );
}
