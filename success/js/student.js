//start student details retrive coding

$(document).ready(function(){
    var db_name = sessionStorage.getItem('db_name');
    var database = window.indexedDB.open(db_name);
    var student_class = sessionStorage.getItem('student_class');
    database.onsuccess = function(){
        var idb = this.result;
        var permission = idb.transaction('admission','readwrite');
        var access = permission.objectStore('admission');
        var read_keys = access.getAllKeys();
        read_keys.onsuccess = function(){
            var keys_array = this.result;
            var i;
            for(i=0;i<keys_array.length;i++)
            {
                var read_data = access.get(keys_array[i]);
                read_data.onsuccess = function(){
                    var student_data = this.result;
                    if(student_data.class_student == student_class)
                    {
                        var tr = document.createElement('TR');
                        var stu_pic_td = document.createElement('TD');
                        var stu_image = new Image();
                        stu_image.src = student_data.profile_pic;
                        stu_image.width = "80";
                        stu_image.height = "80";
                        stu_pic_td.append(stu_image);
                        var stu_name_td = document.createElement('TD');
                        stu_name_td.innerHTML = student_data.student_name;
                        var father_name_td = document.createElement('TD');
                        father_name_td.innerHTML = student_data.father_name;
                        var mother_name_td = document.createElement('TD');
                        mother_name_td.innerHTML = student_data.mother_name;
                        var dob_td = document.createElement('TD');
                        dob_td.innerHTML = student_data.dob;
                        var doa_td = document.createElement('TD');
                        doa_td.innerHTML = student_data.doa;
                        var mobile_one_td = document.createElement('TD');
                        mobile_one_td.innerHTML = student_data.mobile_one;
                        var mobile_two_td = document.createElement('TD');
                        mobile_two_td.innerHTML = student_data.mobile_two;
                        var address_td = document.createElement('TD');
                        address_td.innerHTML = student_data.address;
                        tr.append(stu_pic_td);
                        tr.append(stu_name_td);
                        tr.append(father_name_td);
                        tr.append(mother_name_td);
                        tr.append(dob_td);
                        tr.append(doa_td);
                        tr.append(mobile_one_td);
                        tr.append(mobile_two_td);
                        tr.append(address_td);
                        $('.student-table').append(tr);
                        $('.student-table').addClass('text-center');
                        $('.student-table tr td').addClass('font-weight-bold');
                    }
                }
            }
        }

        var school_permission = idb.transaction('school_info','readwrite');
        var access_school = school_permission.objectStore('school_info');
        var read_school_data = access_school.get(db_name);
        read_school_data.onsuccess = function(){
            var school_info = this.result;
            var image = new Image();
            image.src = school_info.school_logo;
            image.width = "100";
            image.height = "100";
            image.className = 'align-self-center';
            $('.school-logo').html(image);
            $('.school-name').html(school_info.school_name);
            $('.tag').html(school_info.tag);
            var prin_sig = new Image();
            prin_sig.src = school_info.principle_signature;
            prin_sig.width = "250";
            prin_sig.height = "50";
            $('.prin-sign').html(prin_sig);
            $('.prin-text').html('<br><b>PRINCIPLE SIGNATURE</b>');
            var dir_sig = new Image();
            dir_sig.src = school_info.director_signature;
            dir_sig.width = "250";
            dir_sig.height = "50";
            $('.dir-sign').html(dir_sig);
            $('.dir-text').html('<br><b>DIRACTOR SIGNATURE</b>');
        }
    }
});

//end student details retrive coding