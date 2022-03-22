# Branch Maker
Branch Maker

## Create Workflow
Create a workflow (eg: `.github/workflows/finder.yml` see Creating a Workflow file) to utilize the labeler action with content:

```yml
- name: Checkout
  uses: actions/checkout@v2
  with:
    ref: develop

- name: Set Ref SHA
  id: sha
  run: echo ::set-output name=ref-sha::$(git log -1 --format='%H')

- name: Make Branch 
  id: branch-maker
  uses: jsryudev/branch-maker@v0.1.0
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
    ref-name: release
    ref-sha: ${{ steps.sha.outputs.ref-sha }}

- name: Echo Latest Release Branch
  run: echo "${{ steps.release-branch-finder.outputs.release-branch }}"
```

## Inputs
Various inputs are defined in [`action.yml`](action.yml)

| Name | Description | Default | Required |
| - | - | - | - |
| `repo-token` | Token to use to authorize label changes. Typically the GITHUB_TOKEN secret | N/A | N/A |
| `ref-name` | The name of the branch to be maked | N/A | Y |
| `ref-sha` | The reference SHA of the branch to be maked | N/A | Y |