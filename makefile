# Determine the operating system
ifeq ($(OS),Windows_NT)
    OS_TYPE := Windows
else
    OS_TYPE := $(shell uname -s)
endif

create-change-log:
ifeq ($(OS_TYPE),Windows)
	$(SHELL_CMD) ci\version\create-change-log.bat
else
	$(SHELL_CMD) ci/version/create-change-log.sh
endif
