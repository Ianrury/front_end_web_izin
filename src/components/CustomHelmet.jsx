import { Helmet } from "react-helmet-async";

const CustomHelmet = ({ title, description }) => {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default CustomHelmet;
