COMMON="Common"
NODE_MODULE="node_modules/cerebral-cereal-common"
APPS=(LearnTamil Recipes)
TIME_INTERVAL=5

echo "Running Cerebral Cereal common directory sync (PID = $$)..."

for APP in ${APPS[@]}
do
  # If the symlink node module directory exists, remove it
  APP_NODE_MODULE="$APP/$NODE_MODULE"
  if [[ -L $APP_NODE_MODULE ]]; then
      echo "Removing node modules symlink for $APP..."
      rm -r $APP_NODE_MODULE
      mkdir $APP_NODE_MODULE
  fi
done

# Loop and sync the directory if changes are detected
while true; do
    for APP in ${APPS[@]}
    do
      APP_NODE_MODULE="$APP/$NODE_MODULE"
      if [[ $(diff -rq $COMMON $APP_NODE_MODULE) ]]; then
          echo "Syncing directories for $APP..."
          rsync -r --exclude 'node_modules' $COMMON/ $APP_NODE_MODULE/ --delete
      fi
    done
    sleep $TIME_INTERVAL
done
