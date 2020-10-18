# auto-squash-commit(WIP)

## Used

```shell
auto-squash-commit [head]
```

Just like executing `git rebase [head]`

By default, merge your submissions according to the `#[id]` in your submission message, it will find the commit with the same ID and use the first submitted information as the merged submission information.

```shell
auto-squash-commit [head] -- [-m|--match] [string|regex]
```

## Dev

```shell
npm i
npm run dev
```
