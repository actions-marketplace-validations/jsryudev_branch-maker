import * as core from '@actions/core';
import * as github from '@actions/github';

import { Inputs, Outputs } from './constants';

type ClientType = ReturnType<typeof github.getOctokit>;

export async function run() {
  try {
    const token = core.getInput(Inputs.RepoToken, { required: true });
    const refSHA = core.getInput(Inputs.RefSHA, { required: true });
    const refName = core.getInput(Inputs.RefName, { required: true });

    const client = github.getOctokit(token);

    const refs = await getRefs(client, refName);

    if (refs.length) {
      core.setFailed(`aleady exist ref name: ${refName}`);
    }

    const ref = await createRef(client, refName, refSHA);
    core.setOutput(Outputs.RefName, ref.ref.replace('refs/heads/', ''));
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

async function getRefs(client: ClientType, match: string) {
  const iterator = client.paginate.iterator(client.rest.git.listMatchingRefs, {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: ''
  });

  const matchedRefs: string[] = [];

  for await (const { data: refs } of iterator) {
    const target = refs
      .map(ref => ref.ref)
      .filter(ref => ref === `refs/heads/${match}`)
      .map(ref => ref.replace('refs/heads/', ''));

    matchedRefs.push(...target);
  }

  return matchedRefs;
}

async function createRef(client: ClientType, refName: string, refSHA: string) {
  const { data: ref } = await client.rest.git.createRef({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: `refs/heads/${refName}`,
    sha: refSHA
  });

  return ref;
}
