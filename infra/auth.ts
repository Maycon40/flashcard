import type { GetServerSideProps, GetServerSidePropsContext } from "next";

export async function ensureUser(
  context: GetServerSidePropsContext,
): Promise<any> {
  const { req } = context;

  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers["host"];
  const origin = `${proto}://${host}`;

  const res = await fetch(`${origin}/api/v1/user`, {
    headers: {
      cookie: req.headers.cookie || "",
    },
  });

  if (res.status === 200) {
    const user = await res.json();

    return {
      props: {
        user,
      },
    };
  }

  return false;
}

// eslint-disable-next-line no-unused-vars
type AuthCallback = (context: GetServerSidePropsContext) => Promise<any> | any;

export function withAuth(func?: AuthCallback): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    const auth = await ensureUser(context);

    if (auth) {
      if (func) {
        const res = await func(context);

        return {
          props: {
            ...res.props,
            ...auth.props,
          },
        };
      }

      return { props: auth.props };
    }

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  };
}

export function withLogin(): GetServerSideProps {
  return async (context) => {
    const auth = await ensureUser(context);

    if (auth) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return { props: {} };
  };
}
