import { Link } from "react-router-dom";

export default function BreadcrumbCom({
  paths = [{ name: "home", path: "/" }],
}) {
  return (
    <>
      {paths && paths.length > 0 && (
        <div className="breadcrumb-wrapper font-400 text-[13px] text-qblack mb-[23px]">
          {paths.map((path) => (
            <span key={path.name}>
              <Link to={path.path}>
                <span className="mx-1 capitalize">{path.name}</span>
              </Link>
              <span className="sperator">/</span>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
