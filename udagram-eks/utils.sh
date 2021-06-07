#!/bin/bash

# Display an easy to spot banner labelled with given text.
#
# Usage:
#
# banner "<TEXT>"
#
# $1 the given text used to label the banner

banner() {
  echo 
  echo "=============================================================================================================="
  echo "${1}"
  echo "=============================================================================================================="
  echo 
}


# A general-purpose function to ask Yes/No questions either with or without a default answer.
# It keeps repeating the question until it gets a valid answer.
#
# Usage:
#
# ask "<QUESTION_REQUIRING_Y_OR_N_REPLY>?" [Y|N]
#
# $1 the question to ask
# $2 the optional default answer - either Y or N
#
# Return 0 for Y reply and 1 for N reply

ask() {

  banner "${1}"

  local prompt default reply

  if [[ ${2:-} = 'Y' ]]; then
    prompt='Y/n'
    default='Y'
  elif [[ ${2:-} = 'N' ]]; then
    prompt='y/N'
    default='N'
  else
    prompt='y/n'
    default=''
  fi

  while true; do

    # Ask the question (not using "read -p" as it uses stderr not stdout)
    echo -n "$1 [$prompt] "

    # Read the answer (use /dev/tty in case stdin is redirected from somewhere else)
    read -r reply </dev/tty

    # Default?
    if [[ -z $reply ]]; then
        reply=$default
    fi

    # Check if the reply is valid
    case "$reply" in
        Y*|y*) return 0 ;;
        N*|n*) return 1 ;;
    esac

  done
}

