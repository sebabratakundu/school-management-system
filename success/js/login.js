//start add item coding 

$(document).ready(function () {
    $('.add-btn').click(function () {
        var add_element = '<div class="input-group mb-4"><input type="text" name="fee name" placeholder="fees name" class="form-control border-0 shadow-sm fee-name"><input type="number" name="fee" placeholder="fee" class="form-control  border-0 shadow-sm fee"><div class="input-group-append"><span class="input-group-text bg-warning border-0">Monthly</span></div></div>';
        $('.add-item-inputs').append(add_element);
    });
});

//end add item coding

//start set amount coding

$(document).ready(function () {
    $('#set-amount-form').submit(function () {
        var student_class = $('#student-class').val();
        var fee_name = [];
        var fee = [];
        var i;
        $('.fee-name').each(function (i) {
            fee_name[i] = $(this).val();
        });

        $('.fee').each(function (i) {
            fee[i] = $(this).val();
        });

        var payment_obj = {
            student_class: student_class,
            fee_name: fee_name,
            fee: fee
        };

        //store amount data into the database

        var db_name = sessionStorage.getItem('db_name');
        var open_database = window.indexedDB.open(db_name);
        open_database.onsuccess = function () {
            var idb = this.result;
            var permission = idb.transaction('fees', 'readwrite');
            var access = permission.objectStore('fees');
            var add_fees = access.put(payment_obj);
            add_fees.onsuccess = function () {
                alert('fee updated successfully ');
                $('#set-amount-form').trigger('reset');
                window.location = location.href;
            }

            add_fees.onerror = function () {
                alert('something went worng !!');
            }

        }

        return false;

    });
});

//end set amount coding

//start check fees coding

$(document).ready(function () {
    $('#check-fee-btn').click(function () {
        $('#show-fee-table').html('');
        $('#check-fee-modal').modal();
        var get_db_name = sessionStorage.getItem('db_name');
        var database_name = window.indexedDB.open(get_db_name);
        database_name.onsuccess = function () {
            var idb = this.result;
            var permission = idb.transaction('fees', 'readwrite');
            var access = permission.objectStore('fees');
            var read_all_keys = access.getAllKeys();
            read_all_keys.onsuccess = function () {
                var key_obj = this.result;
                var i, j;
                for (i = 0; i < key_obj.length; i++) {
                    var read_data = access.get(key_obj[i]);
                    read_data.onsuccess = function () {
                        var student_class_obj = this.result;
                        var ul = document.createElement('UL');
                        ul.className = 'nav nav-tabs';
                        var li = document.createElement('LI');
                        li.className = 'nav-item';
                        var a = document.createElement('A');
                        a.innerHTML = 'Class - ' + student_class_obj.student_class;
                        a.className = 'nav-link active';
                        a.style.background = '#B8DAFF';
                        a.style.fontWeight = 'bold';
                        a.style.borderBottom = '0';
                        a.href = '#';
                        li.append(a);
                        ul.append(li);
                        $('#show-fee-table').append(ul);

                        var table = document.createElement('TABLE');
                        table.className = 'table text-center border-right border-left border-bottom';
                        var tr_for_th = document.createElement('TR');
                        var tr_for_td = document.createElement('TR');
                        for (j = 0; j < student_class_obj.fee_name.length; j++) {
                            var th = document.createElement('TH');
                            th.className = 'border-0 table-primary';
                            th.innerHTML = student_class_obj.fee_name[j];
                            tr_for_th.append(th);
                        }

                        var edit_th = document.createElement('TH');
                        edit_th.innerHTML = 'Edit Fee';
                        edit_th.className = 'border-0 table-primary';
                        tr_for_th.append(edit_th);

                        var delete_th = document.createElement('TH');
                        delete_th.innerHTML = 'Delete Fee';
                        delete_th.className = 'border-0 table-primary';
                        tr_for_th.append(delete_th);

                        for (j = 0; j < student_class_obj.fee.length; j++) {
                            var td = document.createElement('TD');
                            td.className = 'border-0';
                            td.innerHTML = student_class_obj.fee[j];
                            tr_for_td.append(td);
                        }

                        var edit_td = document.createElement('TD');
                        edit_td.innerHTML = "<i class='fa fa-edit'></i>";
                        edit_td.className = 'border-0';
                        tr_for_td.append(edit_td);

                        //edit class record

                        edit_td.onclick = function () {
                            var table = this.parentElement.parentElement;
                            var ul = table.previousSibling;
                            var a = ul.getElementsByTagName('A');
                            var student_class = a[0].innerHTML;
                            var class_split = student_class.split(' ');
                            $('#student-class').val(class_split[2]);
                            var tr = table.getElementsByTagName('TR');
                            var th = tr[0].getElementsByTagName('TH');
                            var td = tr[1].getElementsByTagName('TD');
                            var fee_name = document.getElementsByClassName('fee-name');
                            var fee = document.getElementsByClassName('fee');
                            fee_name[0].parentElement.remove();
                            var i;
                            for (i = 0; i < th.length - 2; i++) {
                                $('.add-btn').click();
                                fee_name[i].value = th[i].innerHTML;
                                fee[i].value = td[i].innerHTML;
                                $('#check-fee-modal').modal('hide');
                            }

                            $('.set-fee').addClass('animated shake');
                        }

                        var delete_td = document.createElement('TD');
                        delete_td.innerHTML = "<i class='fa fa-trash'></i>";
                        delete_td.className = 'border-0';
                        tr_for_td.append(delete_td);

                        //delete class record

                        delete_td.onclick = function () {
                            var ul = this.parentElement.parentElement.previousSibling;
                            var a = ul.getElementsByTagName('A');
                            var student_class = a[0].innerHTML;
                            var class_split = student_class.split(' ');
                            var db_name = sessionStorage.getItem('db_name');
                            var db = window.indexedDB.open(db_name);
                            db.onsuccess = function () {
                                var idb = this.result;
                                var permission = idb.transaction('fees', 'readwrite');
                                var access = permission.objectStore('fees');
                                var delete_data = access.delete(class_split[2]);
                                delete_data.onsuccess = function () {
                                    delete_td.parentElement.parentElement.previousSibling.remove();
                                    delete_td.parentElement.parentElement.remove();
                                }
                            }
                        }
                        table.append(tr_for_th);
                        table.append(tr_for_td);
                        $('#show-fee-table').append(table);

                    }
                }
            }
        }
    });
});

//end check fee coding

// start store fee in admission form coding

$(document).ready(function () {
    var database_name = sessionStorage.getItem('db_name');
    var database = window.indexedDB.open(database_name);
    database.onsuccess = function () {
        var idb = this.result;
        var permission = idb.transaction('fees', 'readwrite');
        var access = permission.objectStore('fees');
        var get_keys = access.getAllKeys();
        get_keys.onsuccess = function () {
            var key_array = this.result;
            var i;
            for (i = 0; i < key_array.length; i++) {
                var option = document.createElement('OPTION');
                option.value = key_array[i];
                option.innerHTML = key_array[i];
                $('#class-student').append(option);
            }

            //to find student by class

            for (i = 0; i < key_array.length; i++) {
                var option = document.createElement('OPTION');
                option.value = key_array[i];
                option.innerHTML = key_array[i];
                $('#stu-class-find').append(option);
            }
        }
    }
});

// end store fee in admission form coding

//start upload pic coding

$(document).ready(function () {
    $('#upload-img-btn').on('change', function () {
        var choosen_img = this.files[0];
        var temp_url = URL.createObjectURL(choosen_img);
        $('#profile-pic').attr('src', temp_url);
        var reader = new FileReader();
        reader.readAsDataURL(choosen_img);
        reader.onload = function () {
            sessionStorage.setItem('profile_pic', this.result);
        }
    });
});

//end upload pic coding

//start admission coding

$(document).ready(function () {
    $('#admission-form').submit(function () {
        var a_no, i, max = 0;
        var database_name = sessionStorage.getItem('db_name');
        var database = window.indexedDB.open(database_name);
        database.onsuccess = function () {
            var idb = this.result;
            var permission = idb.transaction('admission', 'readwrite');
            var access = permission.objectStore('admission');
            var get_keys = access.getAllKeys();
            get_keys.onsuccess = function () {
                var key_array = this.result;
                if (key_array.length == 0) {
                    a_no = 1;
                }
                else {
                    for (i = 0; i < key_array.length; i++) {
                        var number = Number(key_array[i])
                        if (number > max) {
                            max = number;
                        }
                    }

                    a_no = max + 1;
                }
                var date = new Date($('#dob').val());
                var dob_day = date.getDate();
                var dob_month = date.getMonth() + 1;
                var dob_year = date.getFullYear();
                var dob = dob_day + '/' + dob_month + '/' + dob_year;
                var current_date = new Date();
                var doa_day = current_date.getDate();
                var doa_month = current_date.getMonth() + 1;
                var doa_year = current_date.getFullYear();
                var doa = doa_day + '/' + doa_month + '/' + doa_year;
                if (sessionStorage.getItem('profile_pic') != null) {
                    var student_address = document.getElementById('address');
                    var stu_detail_obj = {
                        adm_no: a_no,
                        student_name: $('#student-name').val(),
                        father_name: $('#father-name').val(),
                        mother_name: $('#mother-name').val(),
                        dob: dob,
                        gender: $('#gender').val(),
                        mobile_one: $('#mobile-one').val(),
                        mobile_two: $('#mobile-two').val(),
                        class_student: $('#class-student').val(),
                        admit_in: $('#admit-in').val(),
                        address: $('#address').val(),
                        doa: doa,
                        invoice:[],
                        profile_pic: sessionStorage.getItem('profile_pic')
                    };

                    sessionStorage.removeItem('profile_pic');

                    var db_name = sessionStorage.getItem('db_name');
                    var db = window.indexedDB.open(db_name);
                    db.onsuccess = function () {
                        var idb = this.result;
                        var permission = idb.transaction('admission', 'readwrite');
                        var access = permission.objectStore('admission');
                        var add_data = access.add(stu_detail_obj);
                        add_data.onsuccess = function () {
                            var success_msg = "<div class='alert alert-success'><i class='fa fa-close close' data-dismiss='alert'></i> <b>Admission success... </b><a href='admission_slip.html'>get admission document</a></div>";
                            $('.alert-box').html(success_msg);
                            setTimeout(function () {
                                $('#admission-form').trigger('reset');
                                $('#profile-pic').attr('src','../images/upload_pic.png');
                            }, 2000);
                            invoice_no();
                        }

                        add_data.onerror = function () {
                            var failed_msg = "<div class='alert alert-warning'><i class='fa fa-close close' data-dismiss='alert'></i> <b>Admission failed !! </b></div>";
                            $('.alert-box').html(failed_msg);
                        }
                    }
                }
                else {
                    alert('Please upload student picture first..');
                }
            }
        }
        return false;
    });
});

//end admission coding

//start left sidebar coding

$(document).ready(function () {
    var db_name = sessionStorage.getItem('db_name');
    $('.school-name').html(db_name);
    $('.school-name').css({ textTransform: 'uppercase' });
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function () {
        var idb = this.result;
        var permission = idb.transaction('school_info', 'readwrite');
        var access = permission.objectStore('school_info');
        var read_data = access.get(db_name);
        read_data.onsuccess = function () {
            var school_info = this.result;
            $('.tag-line').html(school_info.tag);
            $('.tag-line').css({
                fontFamily: 'sans-serif',
                color: '#0069D9'
            });
        }
    }
});

//end left sidebar coding

//start admission no coding

function invoice_no() {
    var db_name = sessionStorage.getItem('db_name');
    var database = window.indexedDB.open(db_name);
    var a = 0;
    database.onsuccess = function () {
        var idb = this.result;
        var permission = idb.transaction('admission', 'readwrite');
        var access = permission.objectStore('admission');
        var read_all_keys = access.getAllKeys();
        read_all_keys.onsuccess = function () {
            var keys_array = this.result;
            var i;
            for (i = 0; i < keys_array.length; i++) {
                if (keys_array[i] > a) {
                    a = keys_array[i];
                }
            }

            var final_no = a + 1;
            $('.invoice-no').html(final_no);
            sessionStorage.setItem('admission_no', a);
        }
    }
};


invoice_no();
//end admission no coding

//start find student coding

$(document).ready(function () {
    $('.find-student-btn').click(function () {
        var student_admission_no = $('.find-student').val();
        sessionStorage.setItem('admission_no', student_admission_no);
        window.location = 'admission_slip.html';
    });
});

//end find student coding

//start director and principle signature show or hide coding

$(document).ready(function () {
    var db_name = sessionStorage.getItem('db_name');
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function () {
        var idb = this.result;
        var permission = idb.transaction('school_info', 'readwrite');
        var access = permission.objectStore('school_info');
        var read_data = access.get(db_name);
        read_data.onsuccess = function () {
            var school_info = this.result;
            if (school_info.director_signature == '') {
                $('.director-sig').removeClass('d-none');
                $('.dir-sig-box').addClass('d-none');
            }
            else {
                $('.dir-sig-box').removeClass('d-none');
                $('.director-sig').addClass('d-none');
                var image = new Image();
                image.src = school_info.director_signature;
                image.width = '150';
                image.height = '50';
                $('.dir-sig-li').html(image);
            }

            if (school_info.principle_signature == '') {
                $('.principle-sig').removeClass('d-none');
                $('.prin-sig-box').addClass('d-none');
            }
            else {
                $('.prin-sig-box').removeClass('d-none');
                $('.principle-sig').addClass('d-none');
                var image = new Image();
                image.src = school_info.principle_signature;
                image.width = '150';
                image.height = '50';
                $('.prin-sig-li').html(image);
            }
        }
    }
});

//end director and principle signature show or hide coding

//start director signature upload coding

$(document).ready(function () {
    $('#dir-sig-input').on('change', function () {
        var sigeture = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(sigeture);
        reader.onload = function () {
            var sig_data = this.result;
            var db_name = sessionStorage.getItem('db_name');
            var database = window.indexedDB.open(db_name);
            database.onsuccess = function () {
                var idb = this.result;
                var permission = idb.transaction('school_info', 'readwrite');
                var access = permission.objectStore('school_info');
                var read_data = access.get(db_name);
                read_data.onsuccess = function () {
                    var school_info = this.result;
                    school_info.director_signature = sig_data;
                    var update_student_info = access.put(school_info);
                    update_student_info.onsuccess = function () {
                        window.location = location.href;
                    }

                    update_student_info.onerror = function () {
                        alert("can't update ! something wrong !!")
                    }
                }
            }
        }
    });
});

//end director signature upload coding

//start director signature delete coding

$(document).ready(function () {
    $('.del-dir-sig-btn').on('click', function () {
        var db_name = sessionStorage.getItem('db_name');
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function () {
            var idb = this.result;
            var permission = idb.transaction('school_info', 'readwrite');
            var access = permission.objectStore('school_info');
            var read_data = access.get(db_name);
            read_data.onsuccess = function () {
                var school_info = this.result;
                school_info.director_signature = '';
                var update_student_info = access.put(school_info);
                update_student_info.onsuccess = function () {
                    window.location = location.href;
                }

                update_student_info.onerror = function () {
                    alert("can't update ! something wrong !!")
                }
            }
        }
    });
});

//end director signature delete coding


//start principle signature upload coding

$(document).ready(function () {
    $('#prin-sig-input').on('change', function () {
        var sigeture = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(sigeture);
        reader.onload = function () {
            var sig_data = this.result;
            var db_name = sessionStorage.getItem('db_name');
            var database = window.indexedDB.open(db_name);
            database.onsuccess = function () {
                var idb = this.result;
                var permission = idb.transaction('school_info', 'readwrite');
                var access = permission.objectStore('school_info');
                var read_data = access.get(db_name);
                read_data.onsuccess = function () {
                    var school_info = this.result;
                    school_info.principle_signature = sig_data;
                    var update_student_info = access.put(school_info);
                    update_student_info.onsuccess = function () {
                        window.location = location.href;
                    }

                    update_student_info.onerror = function () {
                        alert("can't update ! something wrong !!")
                    }
                }
            }
        }
    });
});

//end principle signature upload coding

//start principle signature delete coding

$(document).ready(function () {
    $('.del-prin-sig-btn').on('click', function () {
        var db_name = sessionStorage.getItem('db_name');
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function () {
            var idb = this.result;
            var permission = idb.transaction('school_info', 'readwrite');
            var access = permission.objectStore('school_info');
            var read_data = access.get(db_name);
            read_data.onsuccess = function () {
                var school_info = this.result;
                school_info.principle_signature = '';
                var update_student_info = access.put(school_info);
                update_student_info.onsuccess = function () {
                    window.location = location.href;
                }

                update_student_info.onerror = function () {
                    alert("can't update ! something wrong !!")
                }
            }
        }
    });
});

//end principle signature delete coding

//start school logo coding

$(document).ready(function () {
    $('#school-logo-input').on('change', function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            var image_encoded_string = this.result;
            var db_name = sessionStorage.getItem('db_name');
            var database = window.indexedDB.open(db_name);
            database.onsuccess = function () {
                var idb = this.result;
                var permission = idb.transaction('school_info', 'readwrite');
                var access = permission.objectStore('school_info');
                var read_data = access.get(db_name);
                read_data.onsuccess = function () {
                    var school_info = this.result;
                    school_info.school_logo = image_encoded_string;
                    var update_data = access.put(school_info);
                    update_data.onsuccess = function () {
                        window.location = location.href;
                    }

                    update_data.onerror = function () {
                        alert('update failed !!');
                    }
                }
            }
        }
    });
});

//end school logo coding

//start school logo show coding

$(document).ready(function () {
    var db_name = sessionStorage.getItem('db_name');
    var database = window.indexedDB.open(db_name);
    database.onsuccess = function () {
        var idb = this.result;
        var permission = idb.transaction('school_info', 'readwrite');
        var access = permission.objectStore('school_info');
        var read_data = access.get(db_name);
        read_data.onsuccess = function () {
            var school_info = this.result;
            if (school_info.school_info !== '') {
                var school_logo = school_info.school_logo;
                var image = new Image();
                image.src = school_logo;
                image.width = '110';
                image.height = '100';
                $('#school-logo-box').html(image);
            }
        }
    }
});

//end school logo show coding

//start invoice cut coding

$(document).ready(function(){
    var invoice_no;
    $('.invoice-btn').click(function(){
        var a_no = Number($('.admission-no').val());
        var invoice_date = $('.invoice-date').val();
        var date_api = new Date(invoice_date);
        var invoice_day = date_api.getDate();
        var invoice_month = date_api.getMonth()+1;
        var invoice_year = date_api.getFullYear();
        var updated_invoice_date = invoice_day+'/'+invoice_month+'/'+invoice_year;
        var db_name = sessionStorage.getItem('db_name');
        var database = window.indexedDB.open(db_name);
        database.onsuccess = function () {
            var idb = this.result;
            var permission = idb.transaction('admission', 'readwrite');
            var access = permission.objectStore('admission');
            var read_data = access.get(a_no);
            read_data.onsuccess = function(){
                var student_info = this.result;
                if(student_info)
                {
                    var class_student = student_info.class_student;
                    var fee_permission = idb.transaction('fees','readwrite');
                    var fee_access = fee_permission.objectStore('fees');
                    var read_fee = fee_access.get(class_student);
                    read_fee.onsuccess = function(){
                        var fee_data = this.result;
                        if(fee_data)
                        {
                            if(student_info.invoice.length == 0)
                            {
                                invoice_no = 1;
                            }
                            else{
                                invoice_no = student_info.invoice.length+1;
                            }
                            var invoice = {
                                invoice_no:invoice_no,
                                invoice_date : updated_invoice_date,
                                fee_name : fee_data.fee_name,
                                fee : fee_data.fee
                            };

                            var update_permission = idb.transaction('admission','readwrite');
                            var update_access = update_permission.objectStore('admission');
                            var read_adm_data = update_access.get(a_no);
                            read_adm_data.onsuccess = function(){
                                var stu_data = this.result;
                                stu_data.invoice.push(invoice);                            //to update a array property we use push()
                                var updated_adm_data = update_access.put(stu_data);
                                updated_adm_data.onsuccess = function(){
                                    sessionStorage.setItem('adm_invoice_no',a_no);
                                    window.location = "invoice.html";
                                }
                                updated_adm_data.onerror = function(){
                                    alert('update failed. Something wrong !!');
                                }
                            }
                        }
                        else{
                            alert('class fee not present. Please set the fee');
                        }
                    }
                }
                else{
                    alert('Student not exist');
                }
            }
        }

    });
});

//end invoice cut coding

//start find student by class coding

$(document).ready(function(){
    $('#stu-class-find').on('change',function(){
        sessionStorage.setItem('student_class',this.value);
        window.location = 'student.html';
    });
});

//end find student by class coding