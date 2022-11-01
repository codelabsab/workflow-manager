import { useRouter } from "next/router";

export default function useFullRepoName() {
  const router = useRouter();

  const { namespace, name } = router.query;

  return `${namespace}/${name}`;
}
