//start invoice coding

$(document).ready(function(){
    var db_name = sessionStorage.getItem('db_name');
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function(){
        var idb = this.result;
        var permission = idb.transaction('school_info','readwrite');
        var access = permission.objectStore('school_info');
        var read_data = access.get(db_name);
        read_data.onsuccess = function(){
            var school_info = this.result;
            var image = new Image();
            image.src = school_info.school_logo;
            image.width = "88";
            image.height = "80";
            image.className = 'align-self-center';
            $('.school-logo').html(image);
            $('.school-name').html(school_info.school_name);
            $('.tag').html(school_info.tag);

            //principle signature

            var prin_image = new Image();
            prin_image.src = school_info.principle_signature;
            prin_image.width = "150";
            prin_image.height = "50";
            $('.prin-sig').html(prin_image);
            $('.prin-text').html('<br><b>PRINCIPLE SIGNATURE</b>')

            //director signature

            var dir_image = new Image();
            dir_image.src = school_info.director_signature;
            dir_image.width = "150";
            dir_image.height = "50";
            $('.dir-sig').html(dir_image);
            $('.dir-text').html('<br><b>DIRECTOR SIGNATURE</b>')

            //student information

            var a_no = Number(sessionStorage.getItem('adm_invoice_no'));
            var addmission_permission = idb.transaction('admission','readwrite');
            var access_addmission = addmission_permission.objectStore('admission');
            var read_student_info = access_addmission.get(a_no);
            read_student_info.onsuccess = function(){
                var student_info = this.result;
                $('.student-name').html(student_info.student_name);
                $('.father-name').html(student_info.father_name);
                $('.student-class').html(student_info.class_student);
                $('.invoice-no').html(student_info.invoice[student_info.invoice.length-1].invoice_no);
                $('.invoice-date').html(student_info.invoice[student_info.invoice.length-1].invoice_date);
                var i,total=0;
                for(i=0;i<student_info.invoice[student_info.invoice.length-1].fee_name.length;i++)
                {
                    var fee_name = student_info.invoice[student_info.invoice.length-1].fee_name[i];
                    var fee = Number(student_info.invoice[student_info.invoice.length-1].fee[i]);
                    document.querySelector('.fee-name').innerHTML += fee_name+'<hr>';
                    document.querySelector('.fee').innerHTML += fee+'<hr>';
                    total += fee; 
                }

                $('.total').html(total);
            }
            read_student_info.onerror = function(){
                alert('something error !!');
            }
        }
    }
});

//end invoice coding