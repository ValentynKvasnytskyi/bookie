import { PageContext } from "vike/types";
import { ExtendedContext } from "../../../../renderer/usePageContext";
import { redirect } from "vike/abort";

export const guard = async (pageContext: PageContext & ExtendedContext) => {
  const { user } = pageContext;
  const { companySlug } = pageContext.routeParams;
  if (!user) {
    throw redirect("/login");
  }

  if (user.companySlug !== companySlug) {
    throw redirect(`/${user.companySlug}/admin`);
  }
};
