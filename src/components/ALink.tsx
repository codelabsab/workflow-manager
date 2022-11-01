import type { URL } from "types/custom";

type ALinkProps = {
  url: URL;
  label?: string;
};
const ALink = ({ url, label }: ALinkProps) => {
  return (
    <a href={url} className="underline" target="_blank" rel="noreferrer">
      {label ? label : url}
    </a>
  );
};

export default ALink;
