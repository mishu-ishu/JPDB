var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "SCHOOL-DB";
var relName = "STUDENT-TABLE";
var connectionToken = "90934511|-31949225704752288|90962866";

$(document).ready(function () {
    $("#roll_no").focus();

    function saveRecNo2LS(jsonObj) {
        var lvData = JSON.parse(jsonObj.data);
        localStorage.setItem("recno", lvData.rec_no);
    }

    function getrollnoJsonObj() {
        var rollno = $("#roll_no").val();
        var jsonStr = {
            id: rollno
        };
        return JSON.stringify(jsonStr);
    }

    function fillData(jsonObj) {
        saveRecNo2LS(jsonObj);
        var record = JSON.parse(jsonObj.data).record;
        $("#roll_no").val(record.roll_no);
        $("#full_name").val(record.full_name);
        $("#class").val(record.class);
        $("#birth_date").val(record.birth_date);
        $("#address").val(record.address);
        $("#enrollment_date").val(record.enrollment_date);
    }

    function validateAndGetFormData() {
        var roll_noVar = $("#roll_no").val();
        if (roll_noVar === "") {
            alert("Roll Number is required");
            $("#roll_no").focus();
            return "";
        }
        var full_nameVar = $("#full_name").val();
        if (full_nameVar === "") {
            alert("Full Name is required");
            $("#full_name").focus();
            return "";
        }
        var classVar = $("#class").val();
        if (classVar === "") {
            alert("Class is required");
            $("#class").focus();
            return "";
        }

        var birth_dateVar = $("#birth_date").val();
        if (birth_dateVar === "") {
            alert("Birth Date is required");
            $("#birth_date").focus();
            return "";
        }

        var addressVar = $("#address").val();
        if (addressVar === "") {
            alert("Address is required");
            $("#address").focus();
            return "";
        }

        var enrollment_dateVar = $("#enrollment_date").val();
        if (enrollment_dateVar === "") {
            alert("Enrollment Date is required");
            $("#enrollment_date").focus();
            return "";
        }

        var jsonStrObj = {
            roll_no: roll_noVar,
            full_name: full_nameVar,
            class: classVar,
            birth_date: birth_dateVar,
            address: addressVar,
            enrollment_date: enrollment_dateVar
        };
        return JSON.stringify(jsonStrObj);
    }

    function get() {
        var rollnoJsonObj = getrollnoJsonObj();
        var getRequest = createGET_BY_KEYRequest(connectionToken, dbName, relName, rollnoJsonObj);
        jQuery.ajaxSetup({ async: false });
        var resultObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
        jQuery.ajaxSetup({ async: true });
        if (resultObj.status === 400) {
            $("#Save").prop("disabled", false);
            $("#Reset").prop("disabled", false);
            $("#full_name").focus();
        } else if (resultObj.status === 200) {
            $("#roll_no").prop("disabled", true);
            fillData(resultObj);
            $("#Change").prop("disabled", false);
            $("#Reset").prop("disabled", false);
            $("#roll_no").focus();
        }
    }

    function resetForm() {
        $("#roll_no").val("");
        $("#full_name").val("");
        $("#class").val("");
        $("#birth_date").val("");
        $("#address").val("");
        $("#enrollment_date").val("");
        $("#roll_no").prop("disabled", false);
        $("#Save").prop("disabled", false);
        $("#Change").prop("disabled", false);
        $("#Reset").prop("disabled", false);
        $("#roll_no").focus();
    }

    function save() {
        var jsonStr = validateAndGetFormData();
        if (jsonStr === "") {
            return;
        }
        var putReqStr = createPUTRequest(connectionToken, jsonStr, dbName, relName);
        jQuery.ajaxSetup({ async: false });
        var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
        alert(JSON.stringify(resultObj));
        jQuery.ajaxSetup({ async: true });
        resetForm();
        $("#roll_no").focus();
    }

    function change() {
        $("#Change").prop("disabled", true);
        var jsonChg = validateAndGetFormData();
        var updateRequest = createUPDATERecordRequest(connectionToken, jsonChg, dbName, relName, localStorage.getItem("recno"));
        jQuery.ajaxSetup({ async: false });
        var resultObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
        alert(JSON.stringify(resultObj));
        jQuery.ajaxSetup({ async: true });
        resetForm();
        $("#roll_no").focus();
    }

    $("#Save").click(save);
    $("#Change").click(change);
    $("#Reset").click(resetForm);
});
