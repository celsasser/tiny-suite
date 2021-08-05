#!/usr/bin/env bash
#################################################################
# runs the command in param $1 for every module in our project.
#################################################################
set -x

ROOT_DIRECTORY=`dirname ${0}`
NODE_MODULES_BIN=${ROOT_DIRECTORY}/node_modules/.bin
# tsc=${NODE_MODULES_BIN}/tsc

if [[ -z "${1}" ]]
then
	echo "error: missing command param";
	echo "usage: execute.sh \"commmand [options]\""
	exit 1;
fi

# these are in order of least to dependencies to some
MODULES="core crow graph midi sgl";

for module in ${MODULES}
do
	pushd ${module}
	${1}
	popd
done
