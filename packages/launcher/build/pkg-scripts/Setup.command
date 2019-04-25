#!/usr/bin/env bash

NVM_EXISTS=false
NODE_EXISTS=false
BREW_EXISTS=false
DAEMON_EXISTS=false

dependencies() {
    echo "Checking system dependencies..."
}

checkNode() {
    dependencies;
    if hash node 2>/dev/null; then
        NODE_EXISTS=true
    else
        echo "No local Node.js installations were found."
        NODE_EXISTS=false
    fi
}

checkNVM() {
    dependencies;
    if hash nvm 2>/dev/null; then
        NVM_EXISTS=true
    else
        echo "No node version manager (NVM) installations were found."
        NVM_EXISTS=false
    fi
}

checkBrew() {
    dependencies;
    if hash brew 2>/dev/null; then
        BREW_EXISTS=true
    else
        echo "No local Homebrew installations were found."
        BREW_EXISTS=false
    fi
}

checkDaemon() {
    dependencies;
    if hash mainframed 2>/dev/null; then
        echo "The Mainframe Daemon is installed, will try to upgrade."
        DAEMON_EXISTS=false
    else
        echo "No local Mainframe Daemon installations were found."
        DAEMON_EXISTS=false
    fi
}

installBrew() {
    echo "Attempting to install Homebrew package manager..."
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
}

installNode() {
    echo "Installing Node.js...";
    #brew install node@10
    nvm install 10
}

installNVM() {
    echo "Installing NVM...";
    # check for git prompt for xcode tools install
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # this loads nvm

}

installDaemon() {
    echo "Installing the Mainframe Daemon...";

    if [ $NVM_EXISTS == true ]; then
        nvm exec 10 npm install --global @mainframe/daemon
        nvm exec 10 npm update --global @mainframe/daemon
    else
        npm install --global @mainframe/daemon
        npm update --global @mainframe/daemon
    fi

}

main() {

    echo -n -e "\033]0;MainframeOS\007"

    checkNode

    if [ $NODE_EXISTS == true ]; then
       checkDaemon
       if [ $DAEMON_EXISTS == true ]; then
            echo "System preinstall complete.";
            exit 0;
       else
            installDaemon;
            echo "";
            echo "";
            echo "System preinstall complete.";
            echo "";
            echo "";
            echo "Congratulations! Your environment is now set up for Mainframe OS. You can close this window and continue with installation step 2 - dragging the app icon to the Applications folder.";
            osascript -e 'tell application "Terminal" to close first window' & exit 0;
            exit 0;
       fi
    else
        checkNVM;
        if [ $NVM_EXISTS == true ]; then
            installNode;
            main;
        else
            installNVM;
            main;
        fi
    fi

    echo "Congratulations! Your environment is now set up for Mainframe OS. You can close this window and continue with installation step 2 - dragging the app icon to the Applications folder.";

    exit;
}

main