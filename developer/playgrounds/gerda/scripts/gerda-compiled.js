//
// Standard Arendelle File System Object Model for TypeScript Code Bases
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
var Arendelle;
(function (Arendelle) {
    /* ────────────────────────────────────────────────────────────────────────────────────────── *
     * ::::::::::::::::::::::::::: F I L E   S Y S T E M   O B J E C T :::::::::::::::::::::::::: *
     * ────────────────────────────────────────────────────────────────────────────────────────── */
    /** File and Directory objects shall both extend from this */
    var FileSystemObject = (function () {
        //
        // ─── FUNCS ──────────────────────────────────────────────────────────────────────
        //
        /**
         * ***
         * Generates a directory.
         * ***
         * **NOTE:** Each directory is being created in the file system root. You then
         * have to move them to where you want using the `.MoveFileToDirectory( )` that
         * is provided for you.
         */
        function FileSystemObject(name) {
            this.Name = name;
            this.Parent = null;
        }
        // ────────────────────────────────────────────────────────────────────────────────	
        /**
         * ***
         * Gets the full path of the object.
         * ***
         * @returns UNIX path in format of: `/something/something_else/file_name`.
         */
        FileSystemObject.prototype.GetFullPath = function () {
            if (this.Parent != null) {
                return this.Parent.GetFullPath() + '/' + this.Name;
            }
            else {
                return '/';
            }
        };
        // ────────────────────────────────────────────────────────────────────────────────			
        /**
         * ***
         * Moves the file to a `Directory` object.
         * ***
         * @param	directory		The destination directory.
         * ***
         * @returns 				True if the transmission was successful.
         */
        FileSystemObject.prototype.MoveFileToDirectory = function (directory) {
            // removing forom the first directory
            if (this.Parent != null) {
                this.Parent.RemoveFileName(this.Name);
            }
            // adding to the second directory
            if (directory != null) {
                var couldMove = false;
                if (directory.AppendFileObject(this)) {
                    this.Parent = directory;
                    couldMove = true;
                }
                return couldMove;
            }
            else {
                this.Parent = null;
                return true;
            }
        };
        return FileSystemObject;
    })();
    Arendelle.FileSystemObject = FileSystemObject;
})(Arendelle || (Arendelle = {}));
//
// Standard Arendelle File System Object Model for TypeScript Code Bases
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="file-object.ts" />
var Arendelle;
(function (Arendelle) {
    /* ────────────────────────────────────────────────────────────────────────────────────────── *
     * ::::::::::::::::::::::::::::::::::: F I L E   C L A S S :::::::::::::::::::::::::::::::::: *
     * ────────────────────────────────────────────────────────────────────────────────────────── */
    /** Arendele '.space' / '.arendelle' files */
    var File = (function (_super) {
        __extends(File, _super);
        //
        // ─── FUNCS ──────────────────────────────────────────────────────────────────────
        //
        /**
         * ***
         * Constructs an Arendele file.
         * ***
         * @param	name		The name of the file (For example the file path is:
         * 						`a/b/c/abc.arendelle` then the file name is `abc`)
         * @param 	content		The string content within your file.
         * @param	space		Pass `true`	if your file is an `.space` file and
         * 						`false` if it's an `.arendelle` file.
         */
        function File(name, content, space) {
            _super.call(this, name);
            this.Content = content;
            if (space)
                this.Type = FileType.Space;
            else
                this.Type = FileType.Arendelle;
        }
        // ────────────────────────────────────────────────────────────────────────────────
        /**
         * ***
         * Get's the file type string for the Arendelle files
         * ***
         */
        File.prototype.GetFileTypeEnd = function () {
            if (this.Type == FileType.Space)
                return '.space';
            else
                return '.arendelle';
        };
        // ────────────────────────────────────────────────────────────────────────────────
        /**
         * ***
         * Getts the pull file path way including it's file tye ending
         * ***
         * **NOTE:** the `.GetFullPath( )` provided by the `FileSystemObject`
         * must never be used for the files as it does not include the file type
         */
        File.prototype.GutFullFilePath = function () {
            return this.GetFullPath() + this.GetFileTypeEnd();
        };
        return File;
    })(Arendelle.FileSystemObject);
    Arendelle.File = File;
    /* ────────────────────────────────────────────────────────────────────────────────────────── *
     * ::::::::::::::::::::::::::::::::::: F I L E   T Y P E S :::::::::::::::::::::::::::::::::: *
     * ────────────────────────────────────────────────────────────────────────────────────────── */
    (function (FileType) {
        /** Arendelle '.arendelle' blueprit files */
        FileType[FileType["Arendelle"] = 0] = "Arendelle";
        /** Arendelle '.space' stored space files */
        FileType[FileType["Space"] = 1] = "Space";
    })(Arendelle.FileType || (Arendelle.FileType = {}));
    var FileType = Arendelle.FileType;
})(Arendelle || (Arendelle = {}));
//
// Standard Arendelle File System Object Model for TypeScript Code Bases 
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
/// <reference path="file.ts" />
/// <reference path="file-object.ts" />
var Arendelle;
(function (Arendelle) {
    /* ────────────────────────────────────────────────────────────────────────────────────────── *
     * :::::::::::::::::::::::::::::: D I R E C T O R Y   C L A S S ::::::::::::::::::::::::::::: *
     * ────────────────────────────────────────────────────────────────────────────────────────── */
    var Directory = (function (_super) {
        __extends(Directory, _super);
        //
        // ─── FUNCS ──────────────────────────────────────────────────────────────────────
        //
        /**
         * ***
         * Generates a Directory. <br />
         * ***
         * **NOTE**: To add a directory you have to use the `AppendFileObject()` method.
         * ***
         * @param 	name 		The file name, (For exampe if the file be `a/b/abc.arendelle`
         * 						the name would be `abc`.)
         */
        function Directory(name) {
            _super.call(this, name);
            this.Contents = new Array();
        }
        // ────────────────────────────────────────────────────────────────────────────────
        /**
         * ***
         * Adds `files` / `directories` to the directory.
         * ***
         * @param 	fileObject 		The file you request to be deleted.
         * @returns 				True if the process was successful.
         */
        Directory.prototype.AppendFileObject = function (fileObject) {
            // checks if it's douplicate or not
            var doHaveToAdd = true;
            for (var index = 0; index < this.Contents.length; index++) {
                if (this.Contents[index].Name == fileObject.Name) {
                    doHaveToAdd = false;
                    break;
                }
            }
            if (doHaveToAdd) {
                this.Contents.push(fileObject);
            }
            return doHaveToAdd;
        };
        // ────────────────────────────────────────────────────────────────────────────────
        /**
         * ***
         * Removes a FileSystemObject from the current directory and return true if
         * the process was successful.
         * ***
         * @param 	fileName 	Name of the file you want to deleted (`FileSystemObject.Name`).
         * @returns				True if the deletation was successful.
         */
        Directory.prototype.RemoveFileName = function (fileName) {
            var newFileList = new Array();
            var didDelete = false;
            this.Contents.forEach(function (fileObject) {
                if (fileObject.Name != fileName) {
                    newFileList.push(fileObject);
                    didDelete = true;
                }
            });
            this.Contents = newFileList;
            return didDelete;
        };
        return Directory;
    })(Arendelle.FileSystemObject);
    Arendelle.Directory = Directory;
})(Arendelle || (Arendelle = {}));
//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
var Gerda;
(function (Gerda) {
    var Kernel;
    (function (Kernel) {
        // ────────────────────────────────────────────────────────────────────────────────────────────────────
        /**
         * Reruns the spaces available within the scope caret location is in the code.
         */
        function GetSpaces(blueprintText, caretLocation) {
            //
            // ─── DEFINITIONS ────────────────────────────────────────────────────────────────
            //
            /** Space name rule */
            var spaceNameRegexRule = /^[a-zA-Z0-9\_\s]+$/;
            /** Suggested spaces within the scope */
            var scopedSpaces = [
                [0, 'return', 'return']
            ];
            /** To track the scope */
            var scopeLevel = 0;
            /** To keep track of the character's location within the blueprint */
            var characterLocationIndex = 0;
            //
            // ─── FUNCTIONS ──────────────────────────────────────────────────────────────────
            //
            /**
             * This checks on the list to not to add a spcae that is allready declared.
             */
            var CheckForDouplicateAndAdd = function (spaceToCheck) {
                var doHaveToAdd = true;
                for (var index = 0; index < scopedSpaces.length && doHaveToAdd; index++) {
                    if (scopedSpaces[index][1] == spaceToCheck[1]) {
                        if (scopedSpaces[index][2].length < spaceToCheck[2].length) {
                            scopedSpaces[index][2] = spaceToCheck[2];
                        }
                        doHaveToAdd = false;
                    }
                }
                if (doHaveToAdd) {
                    scopedSpaces.push(spaceToCheck);
                }
            };
            /**
             * Addes a space name to the scoped space list if the space name
             * meets the space name regex and also is not allready added.
             */
            var AppendSpace = function (givenSpaceName) {
                // some cleaning up
                givenSpaceName = givenSpaceName.toLowerCase().trim();
                // checking to see if it's a space name
                if (givenSpaceName.match(spaceNameRegexRule)) {
                    var nameKey = givenSpaceName.replace(/ /g, '');
                    CheckForDouplicateAndAdd([scopeLevel, nameKey, givenSpaceName]);
                }
            };
            //
            // ─── HEADER SCANNER ─────────────────────────────────────────────────────────────
            //
            /*
             * Here what we do is we escape the white spaces and comments till
             * we reach the point where the function header.
             */
            for (scopeLevel = 0; characterLocationIndex < caretLocation; characterLocationIndex++) {
                //
                // TOOLS
                //
                var currentChar = blueprintText[characterLocationIndex];
                /**
                 * Updates the current_char location.
                 */
                var NextCharacter = function () {
                    if (characterLocationIndex < caretLocation - 1) {
                        currentChar = blueprintText[++characterLocationIndex];
                    }
                };
                /**
                 * Escapes the one line comments that starts with the second
                 * character of `char`.
                 */
                var EscapeOneLineComments = function (char) {
                    NextCharacter();
                    while (currentChar != '\n' && characterLocationIndex < caretLocation) {
                        NextCharacter();
                    }
                };
                /**
                 * Escapes the comments like slash star ... star slash
                 */
                var EscapeSlashStarComments = function (firstChar, secondChar) {
                    NextCharacter();
                    var whileControl = true;
                    while (whileControl && characterLocationIndex < caretLocation - 1) {
                        if (currentChar == secondChar) {
                            NextCharacter();
                            if (currentChar == firstChar) {
                                whileControl = false;
                            }
                            else {
                                characterLocationIndex--;
                            }
                        }
                        else {
                            NextCharacter();
                        }
                    }
                };
                /**
                 * Reads the function header '< ... , ... , ... >' and adds function
                 * space into the scopedSpaces
                 */
                var ReadAndParseHeader = function () {
                    var headerText = '';
                    NextCharacter();
                    // reading the header
                    while (currentChar != '>' && characterLocationIndex < caretLocation - 1) {
                        headerText += currentChar;
                        NextCharacter();
                    }
                    // getting the spaces and adding them to the scoped spaces
                    var possibleSpaceDeclerations = headerText.split(',');
                    possibleSpaceDeclerations.forEach(function (possibleSpaceName) {
                        AppendSpace(possibleSpaceName);
                    });
                };
                //
                // BODY
                //
                if (currentChar == ' ' || currentChar == '\t' || currentChar == '\n') {
                    NextCharacter();
                }
                else if (currentChar == '/' && characterLocationIndex + 1 < caretLocation) {
                    NextCharacter();
                    // where we escape the comments:
                    if (currentChar == '-') {
                        EscapeOneLineComments('/');
                    }
                    else if (currentChar == '*') {
                        NextCharacter();
                        EscapeSlashStarComments('/', '*');
                    }
                }
                else if (currentChar == '<') {
                    ReadAndParseHeader();
                }
                else {
                    /*
                     * there is no function header so we just get out and continue
                     * the scannig for normal scope declerations
                     */
                    break;
                }
            }
            //
            // ─── BODY SCANNER ───────────────────────────────────────────────────────────────
            //
            var readingWhiteSpaceInSpaceName = false;
            for (scopeLevel = 1; characterLocationIndex < caretLocation; characterLocationIndex++) {
                var currentChar = blueprintText[characterLocationIndex];
                // If there's an space decleration...
                if (currentChar == '(') {
                    var finding = '';
                    NextCharacter();
                    // Finds the stuff between '(' and ',' or ')'
                    while (currentChar != ',' && currentChar && characterLocationIndex < caretLocation) {
                        // this system here makes all the white spaces count as one space
                        if (currentChar == ' ' || currentChar == '\t' || currentChar == '\n') {
                            if (!readingWhiteSpaceInSpaceName) {
                                finding += ' ';
                                readingWhiteSpaceInSpaceName = true;
                            }
                        }
                        else {
                            finding += currentChar;
                            readingWhiteSpaceInSpaceName = false;
                        }
                        if (characterLocationIndex < caretLocation - 1) {
                            NextCharacter();
                        }
                        else {
                            break;
                        }
                    }
                    // done
                    AppendSpace(finding);
                }
                else if (currentChar == '[' || currentChar == '{') {
                    scopeLevel++;
                }
                else if ((currentChar == ']' || currentChar == '}') && scopeLevel > 0) {
                    scopedSpaces = RemoveSpacesInTheCurrentScope(scopedSpaces, scopeLevel);
                    scopeLevel--;
                }
            } // end of for ( scopeLevel = 1 ; characterLocationIndex < caretLocation ; characterLocationIndex++ )
            // ────────────────────────────────────────────────────────────────────────────────
            return GetSpacesByScopedSpacesArray(scopedSpaces);
            // ────────────────────────────────────────────────────────────────────────────────
        }
        Kernel.GetSpaces = GetSpaces; // end of function GetSpaces
        // ────────────────────────────────────────────────────────────────────────────────────────────────────
        /**
         * Takes the scoped spaces array with the scope_level and removes the
         * spaces declared within the current scope level.
         */
        var RemoveSpacesInTheCurrentScope = function (scopedSpaces, scopeLevel) {
            var newScopedSpacesList = new Array();
            scopedSpaces.forEach(function (spaceWithScope) {
                if (spaceWithScope[0] != scopeLevel) {
                    newScopedSpacesList.push(spaceWithScope);
                }
            });
            return newScopedSpacesList;
        };
        // ────────────────────────────────────────────────────────────────────────────────────────────────────
        /**
         * Converts scoped spaces to normal string array for returning
         */
        var GetSpacesByScopedSpacesArray = function (scopedSpaces) {
            var results = new Array();
            scopedSpaces.forEach(function (scopedSpace) {
                results.push(scopedSpace[2].trim());
            });
            return results;
        };
    })(Kernel = Gerda.Kernel || (Gerda.Kernel = {}));
})(Gerda || (Gerda = {}));
