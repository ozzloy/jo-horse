# jo-horse is a collection of stuff

`jo-horse` will automatically git commit and push all changes in `$CWD`

## quick start

get jo-horse
```bash
npm install -g jo-horse@latest
```

go to a git repo
```bash
git clone git@git.example.com:username/example
cd example
```

and leave `jo-horse` running in there while you edit files:
```bash
jo-horse
```

and `jo-horse` will watch for file edits, commit and push them
immediately.

```
user@host:~/example$ jo-horse
jo horse is running!
🏇 current branch: branch_name
files:
[]
🐎 watching for changes
[11:57:47 AM] added: b
🎠 tracking additions
[branch_name 1b02c3c]
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 b

To git.example.com:username/example
   e647c4d..1b02c3c  branch_name -> branch_name

🦄 additions tracked successfully!
[11:57:52 AM] changed: a
🎠 tracking changes
[branch_name 3b9ec22]
 1 file changed, 1 insertion(+)

To git.example.com:username/example
   1b02c3c..3b9ec22  branch_name -> branch_name

🦄 changes tracked successfully!
[11:57:56 AM] deleted: a
🎠 tracking deletions
[branch_name 762900f]
 1 file changed, 1 deletion(-)
 delete mode 100644 a

To git.example.com:username/example
   3b9ec22..762900f  branch_name -> branch_name

🦄 deletions tracked successfully!
```
