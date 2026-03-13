import type { GetServerSideProps, GetServerSidePropsContext } from "next";

export async function ensureUser(
  context: GetServerSidePropsContext,
): Promise<Boolean> {
  const { req } = context;

  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers["host"];
  const origin = `${proto}://${host}`;

  try {
    const res = await fetch(`${origin}/api/v1/user`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
    });

    if (res.status === 200) {
      return true;
    }
  } catch {
    // ignore network/fetch errors and fallthrough to redirect
  }

  return false;
}

export function withAuth(): GetServerSideProps {
  return async (context) => {
    const auth = await ensureUser(context);

    if (auth) {
      return { props: {} };
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
