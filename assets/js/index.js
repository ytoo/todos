angular.module("index",[])
  .controller("indexCtrl",["$scope",function ($scope) {

    $scope.listArr = [];
    // 页面加载时获取本地数据，如果有就将本地数据赋值给listArr，没有的话，不做操作
    getData();
    function getData() {
      if(localStorage.getItem("listArr")){
        $scope.listArr = angular.fromJson(localStorage.getItem("listArr"));
      }
    }


    // 当鼠标失去焦点时，获取到输入宽度内容，并且判断是否为空
    // 当输入的内容非空有效时，当按下enter键时，将输入框内容存放到一个数组中
    // 然后再将这个数组遍历，生成结构
    // 最后需要将输入框的内容清空

    // 当生成任务列表后，需要判断当前的任务是否已完成,即是否添加completed类名

    $scope.addList = function (e) {
      if(e.keyCode == 13) {
        if($scope.val) {
          $scope.listArr.push({
            name:$scope.val,
            // 是否是已完成状态 默认是未完成
            isCompleted:false,
            // li是否是编辑状态
            // 当li是编辑状态时，label标签会隐藏，li里面最下面的input标签会显示
            isEditing:false
          })
        }
        $scope.val = "";
      }
    };

    // 点击删除对应的任务数组里面的任务
    $scope.deleteList = function (item) {
      $scope.listArr.splice($scope.listArr.indexOf(item),1);
    };

    // 未完成任务的数量
    // 可以遍历listArr数组，根据里面，每一项的isCompleted的值，判断是否完成任务
    $scope.unCompletedListNum = function () {
      // var num=0;
      // for (var i = 0; i < $scope.listArr.length; i++) {
      //    if(!$scope.listArr[i].isCompleted){
      //      num ++;
      //    }  
      // }
      // return num;
      
      // return $scope.listArr.filter(function (item) {
      //   return !item.isCompleted;
      // }).length;

      // console.log($scope.listArr.filter(item => !item.isCompleted));
      // es6中的箭头函数
      return $scope.listArr.filter(item => !item.isCompleted).length;

      // filter()方法是数组的方法，通过回调函数中指定的条件对数组进行筛选
      // 符合条件的保留，不符合的剔除，并返回一个新数组
    };

    // 根据筛选条件对已完成任务和未完成任务进行筛选显示
    // 需要给每个a标签添加点击事件，当点击的时候判断当前标签的代表的任务状态和是否需要添加当前类名active
    // 然后上面的li根据筛选条件，将需要显示的元素过滤出来
    $scope.condition = "";
    $scope.isActive="All";
    $scope.filterList = function (type) {
      switch(type){
        case "All":
          $scope.condition = "";
          $scope.isActive = "All";
          break;
        case "Active":
          $scope.condition = false;
          $scope.isActive = "Active";
          break;
        case "Completed":
          $scope.condition = true;
          $scope.isActive = "Completed";
          break;
      }
    };

    // 点击清除已完成任务（也就是保留未完成任务）
    $scope.clearCompletedList = function () {
      // for (var i = 0; i < $scope.listArr.length; i++) {
      //     if($scope.listArr[i].isCompleted){
      //       $scope.listArr.splice(i,1);
      //       i--;
      //     }
      // }

      // $scope.listArr = $scope.listArr.filter(function (item) {
      //   return !item.isCompleted;
      // });

      $scope.listArr = $scope.listArr.filter(item => !item.isCompleted)

    };

    // 点击类名为toggle-all复选框，实现全选反选功能
    $scope.changeListStatus = function () {
      // for (var i = 0; i < $scope.listArr.length; i++) {
      //    $scope.listArr[i].isCompleted = $scope.status;
      // }

      // $scope.listArr.forEach(function (item) {
      //   item.isCompleted = $scope.status;
      // })

      $scope.listArr.forEach(item => item.isCompleted = $scope.status);


    };

    // 点击list任务栏里面的某个任务，修改任务的状态后，需要根据这个状态判断顶部的toggle-all复选框的status的值
    // 由于顶部复选框的高亮效果对应status值为true,取消高亮效果对应status值为false
    // 即staus值得改变会造成高亮效果的改变
    $scope.updateStatus = function () {
      // for (var i = 0; i < $scope.listArr.length; i++) {
      //    if(!$scope.listArr[i].isCompleted){
      //      $scope.status = false;
      //      // 只要下方的list里面有一项是未完成状态，就立马停止循环，跳出函数
      //      return;
      //    }
      // }
      // $scope.status = true;

      // 只要下方有一项是未完成状态，就取消顶部复选框的高亮效果
      // $scope.status = $scope.listArr.filter(function (item) {
      //   return !item.isCompleted;
      // }).length == 0;

      $scope.status = $scope.listArr.filter(item => !item.isCompleted)==0;
    };

    // 双击label按钮时，需要修改对应的item里面的isEditing 的值
    // 当编辑框显示的时候，需要将对应的item里面的内容显示出来
    $scope.modifyListName = function (list) {
      $scope.listArr.forEach(function (item) {
        item.isEditing = false;
      });
      list.isEditing = true;
    };

    // 当编辑框失去焦点时，需要将编辑框的状态修改为未编辑状态
    // 失去焦点事件发生的前提是需要利用自定义指令iptFocus获取到输入框的焦点，
    // 否则失去焦点事件无法触发
    $scope.cancelEditing = function (list) {
      list.isEditing = false;
    };

    // 当关闭页面的时候，我们需要将任务列表的数据保存起来，以便再次打开页面时，可以获取到
    // 我们需要监听任务数组的改变，当数组改变时，我们就将改变后的数组里的数据保存到本地存储
    // 由于数组是复杂数据，需要用angular.toJson()将数据转换成json字符串，并且监听是深度监听
    $scope.$watch("listArr",function () {
      localStorage.setItem("listArr",angular.toJson($scope.listArr));
    },true);


  }])
  .directive("iptFocus",["$timeout",function ($timeout) {
    return function (scope,element,attributes) {
      // 这里监听的如果是scope.item.isEditing，会导致监听不到。为什么？？
      scope.$watch("item.isEditing",function (newValue) {
        if(newValue){
          $timeout(function () {
            element[0].focus();
          },0);
        }
      })
    }
  }])
