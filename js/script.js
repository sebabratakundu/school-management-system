//start database coding

$(document).ready(function () {

    //indexDB compatibility checking

    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    if (!window.indexedDB) {
        alert('Please update your browser');
    }
    else {
        $('#register-form').submit(function () {
            var check_database = window.indexedDB.databases();
            check_database.then(function(get_pending_obj){
                if(get_pending_obj.length == 0){
                    register();
                }
                else{
                    $('#massage').removeClass('d-none');
                    $('#close-icon').removeClass('d-none')
                    $('#massage').addClass('alert-warning');
                    $('#massage').append("<b>Registrasion failed ! </b><a href='#' >Please purchase multi version sofware</a> <i class='fa fa-trash' title='to manage another school please delete the current school record' data-toggle='tootip' id='delete-icon'></i>");
                    $('#delete-icon').tooltip();
                    $('#delete-icon').click(function(){
                        $('#delete-modal').modal();
                        $('#delete-db-btn').click(function(){
                            var database_name = window.indexedDB.databases();
                            database_name.then(function(pending_db_name){
                                var deleted_db = window.indexedDB.deleteDatabase(pending_db_name[0].name);
                                deleted_db.onsuccess = function(){
                                    $('#register-form').trigger('reset');
                                    $('.hide').html('');
                                    $('.delete-success-notice').removeClass('d-none');
                                    $('#massage').addClass('d-none');
                                    $('#close-icon').addClass('d-none')
                                    $('#massage').html('');
                                    setInterval(function(){
                                        $('.delete-success-notice').addClass('d-none');
                                    },2000);
                                }
                            });
                        });
                    });
                }
            });
            
            return false;
        });

        function register(){
            var school_name = $('#school-name').val();
            var tag = $('#tag').val();
            var email = $('#email').val();
            var password = $('#signup-password').val()
            var website = $('#website').val();
            var mobile = $('#mobile').val();
            var address = $('#address').val();
            var database = window.indexedDB.open(school_name);
            database.onsuccess = function () {
                $('#massage').removeClass('d-none');
                $('#close-icon').removeClass('d-none');
                $('#massage').addClass('alert-success');
                $('#massage').append('<b>Success ! </b>dear admin please login...');
                $('#register-form').trigger('reset');
                setTimeout(function () {
                    $('#massage').addClass('d-none');
                    $('#close-icon').addClass('d-none')
                    $('#massage').html('');
                    $("[href='#login']").click();
                }, 2000);
            }

            database.onerror = function () {
                $('#massage').removeClass('d-none');
                $('#close-icon').removeClass('d-none');
                $('#massage').addClass('alert-warning');
                $('#massage').append('<b>Warning ! </b>something went wrong...');
            }

            database.onupgradeneeded = function () {
                var idb = this.result;
                var data = {
                    school_name: school_name,
                    tag: tag,
                    email: email,
                    password: password,
                    website: website,
                    mobile: mobile,
                    address: address,
                    director_signature : '',
                    principle_signature : '',
                    school_logo: ''
                };
                var object = idb.createObjectStore('school_info', { keyPath: 'school_name' });
                idb.createObjectStore('fees',{keyPath:'student_class'});
                idb.createObjectStore('admission',{keyPath:'adm_no'});
                object.add(data);
            }
        }
    }
});

//end database coding

//start login coding

$(document).ready(function () {
    $('#login-form').submit(function () {
        var username = $('#username').val();
        var login_password = $('#login-password').val()
        var obj = { username: username, password: login_password };
        var json_obj = JSON.stringify(obj);
        sessionStorage.setItem('login', json_obj);
        if (sessionStorage.getItem('login') != null) {
            //find user from database 

            var user_database = window.indexedDB.databases();
            user_database.then(function (pending_obj) {
                var i;
                for (i = 0; i < pending_obj.length; i++) {
                    var db_name = pending_obj[i].name;
                    sessionStorage.setItem('db_name',db_name);
                    var database = window.indexedDB.open(db_name);
                    database.onsuccess = function () {
                        var idb = this.result;
                        var permission = idb.transaction('school_info', 'readwrite');
                        var access = permission.objectStore('school_info');
                        var json_data = access.get(db_name);
                        json_data.onsuccess = function () {
                            var user_data = this.result;
                            if (user_data) {
                                var db_username = user_data.email;
                                var db_password = user_data.password;
                                var login_data = JSON.parse(sessionStorage.getItem('login'));
                                if (db_username == login_data.username) {
                                    if (db_password == login_data.password) {
                                        window.location = 'success/loginPage.html';
                                    }
                                    else {
                                        $('#massage-2').removeClass('d-none');
                                        $('#massage-2').addClass('alert-warning');
                                        $('#massage-2').append('<b>Password not match !! </b>')
                                        $('#login-form').trigger('reset');
                                        setTimeout(function () {
                                            $('#massage-2').addClass('animated fadeOut faster');
                                        }, 2000);
                                    }
                                }
                                else {
                                    $('#massage-2').removeClass('d-none');
                                    $('#massage-2').addClass('alert-warning');
                                    $('#massage-2').append('<b>User not found !! </b>')
                                    $('#login-form').trigger('reset');
                                    setTimeout(function () {
                                        $('#massage-2').addClass('animated fadeOut faster');
                                    }, 2000);
                                }
                            }
                            else {
                                alert('key not found !!');
                            }
                        }
                    }
                }
            });
        }
        else {
            $('#massage-2').removeClass('d-none');
            $('#massage-2').addClass('alert-warning');
            $('#massage-2').append('<b>Warning ! </b>falied to store...')
            $('#login-form').trigger('reset');
            setTimeout(function () {
                $('#massage-2').addClass('animated fadeOut faster');
            }, 2000);
        }
        return false;
    });
});

//end login coding

