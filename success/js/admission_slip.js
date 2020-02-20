//start retriving student data coding

function ready(){
    var db_name = sessionStorage.getItem('db_name');
    var admission_no = sessionStorage.getItem('admission_no');
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function () {
        var idb = this.result;
        var permission = idb.transaction('school_info', 'readwrite');
        var access = permission.objectStore('school_info');
        var read_data = access.get(db_name);
        read_data.onsuccess = function () {
            var school_info = this.result;
            $('.school-name').html(school_info.school_name);
            $('.tag-line').html(school_info.tag);
            $('.mob-phn-no').html('Mob no : '+school_info.mobile);
        }

        var student_permission = idb.transaction('admission','readwrite');
        var student_access = student_permission.objectStore('admission');
        var read_student_data = student_access.get(Number(admission_no));
        read_student_data.onsuccess = function(){
            var student_info = this.result;
            if(student_info)
            {
                var image = new Image();
                image.src = student_info.profile_pic;
                image.style.width = '100%';
                $('.student-pic').html(image);
                $('.student-name').html(student_info.student_name);
                $('.dob').html(student_info.dob);
                $('.gender').html(student_info.gender);
                $('.admission-date').html(student_info.doa);
                $('.father-name').html(student_info.father_name);
                $('.admited-in').html(student_info.admit_in);
                $('.mother-name').html(student_info.mother_name);
                $('.mob-no-1').html(student_info.mobile_one);
                $('.mob-no-2').html(student_info.mobile_two);
                $('.student-address').html(student_info.address);
            }
            else{
                alert('student not found !! ');
            }
        }
    }
};

ready();

//end retriving student coding