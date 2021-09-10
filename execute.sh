#!/usr/bin/env bash
#################################################################
# runs the command in param $1 for every module in our project.
#################################################################
set -e

if [[ -z "${1}" ]]
then
	echo "error: missing command param";
	echo "usage: execute.sh \"commmand [options]\""
	exit 1;
fi

# these are in order of:
#  * least to dependencies to some
#  * most buildable to least buildable
MODULES="core graph midi sgl circles"; # crow

for module in ${MODULES}
do
	pushd ${module}
	${1}
	popd
done
