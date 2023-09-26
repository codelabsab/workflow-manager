SUCCESS=0

for try in {1..3}; do
  status_code=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:3000)
  if [[ "$status_code" -eq 200 ]] ; then
      SUCCESS=1
      break
  else
      echo "Attempt $try failed with status code $status_code"
  fi
  sleep 10
done

if [[ "$SUCCESS" -eq 1 ]] ; then
    echo "Stack seems to be working 🎉"
    exit 0
else
    echo "Stack is not working 😭"
    exit 1
fi