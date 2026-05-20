## Basic
git init  
git branch -m main  
git remote add origin https://github.com/taren250424  
git remote set-url origin https://github.com/taren250424  
git remote -v  
git pull *-u origin main*  
git status  
git add .  
git commit -m \'Initial commit\'  
git commit --amend  
git push *-u origin main*  
git log --oneline --grapgh  
git diff src/main.js  
git config --global core.quotepath false  * Show file paths with non-ASCII chars as readable text (not escaped)

## Checkout
git checkout 3bb45d1  
git checkout main

## Reset
git reset --soft 3bb45d1     * Move HEAD only, keep staged and working files unchanged  
git reset --mixed 3bb45d1    * Move HEAD and reset staging area, keep working files unchanged (default)  
git reset --hard 3bb45d1     * Move HEAD, reset staging area and working directory (all changes lost)  

## Branch
git branch                  * Show local branches  
git branch -r               * Show remote branches  
git checkout -b nb          * Move new branch with history base on current branch  
git checkout --orphan nb    * Move new branch without history  

## Commit Edit Process
1. Start interactive rebase  
   git rebase -i --root          * rebase all commits  
   git rebase -i HEAD~50         * rebase last 50 commits  

2. Change commit action from pick to drop, reword, etc., then save and exit  

3. Resolve conflicts  
   git checkout --theirs .       * use incoming changes  
   git checkout --ours .         * use current changes  
   or manually fix  

4. Stage resolved changes  
   git add .  

5. Continue rebase  
   git rebase --continue  

6. Abort and rollback rebase  
   git rebase --abort  




 