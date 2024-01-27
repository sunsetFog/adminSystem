<template>
  <section class="all-activities">
    <div class="header-info">
      <el-button
        class="newly-build"
        type="danger"
        size="small"
        @click="newlyEdit('新增')"
        >
        <el-icon><Plus /></el-icon>
        &nbsp;新建
        </el-button
      >
      <ul>
        <li
          v-for="(item, index) in tab_list"
          :key="index"
          :class="{ 'active-li': item.active }"
          @click="switchingEquipment(index)"
        >
          {{ item.name }}
        </li>
      </ul>
      <el-button
        class="search-content"
        type="primary"
        size="small"
        @click="getJson('')"
        ><el-icon><Search /></el-icon>搜索</el-button
      >
      <el-select
        class="choose-community"
        v-model="community_value"
        placeholder="请选择平台类型"
        size="small"
        @change="changeCommunity"
        remote
        filterable
        :remote-method="remoteMethod"
      >
        <el-option
          v-for="item in community_arr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <section class="table-box" ref="xTable1">
      <el-table
        row-key="id"
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%;"
      >
        <el-table-column width="50" type="index" align="center" label="排序"/>
        <el-table-column prop="activityNo" label="活动编码" min-width="100">
        </el-table-column>
        <el-table-column min-width="150">
          <template #header> 活动标题 </template>
          <template v-slot="scope">
            <div class="endearment">
              <div
                v-if="scope.row.tips == '1' || scope.row.tips == '1,2' || scope.row.tips == '2,1'"
                class="remen"
                >热门</div
              >
              <div
                v-if="scope.row.tips == '2' || scope.row.tips == '1,2' || scope.row.tips == '2,1'"
                class="zuixin"
                >最新</div
              >
              <span>{{ scope.row.activityTitle }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="detailTitle" label="详情标题" min-width="150">
        </el-table-column>
        <el-table-column prop="isTime" label="下架时间" min-width="200">
        </el-table-column>
        <el-table-column prop="communityName" label="平台类型" min-width="100">
        </el-table-column>
        <el-table-column min-width="180">
          <template #header> 移动入口/详情头部图 </template>
          <template v-slot="scope">
            <previewPictures :photoList="[scope.row.appIndexImg, scope.row.appHeadImg]"></previewPictures>
          </template>
        </el-table-column>
        <el-table-column min-width="180">
          <template #header> PC入口/详情头部图 </template>
          <template v-slot="scope">
            <previewPictures :photoList="[scope.row.pcIndexImg, scope.row.pcHeadImg]"></previewPictures>
          </template>
        </el-table-column>
        <el-table-column min-width="100">
          <template #header> 状态 </template>
          <template v-slot="scope">
            <el-switch v-model="scope.row.status" @on-change="(val) => {
                  statusChange(val, scope.row);
                }"></el-switch>
          </template>
        </el-table-column>
        <el-table-column min-width="120">
          <template #header> 客户端 </template>
          <template v-slot="scope">
            <div v-if="scope.row.client == '2'">
              <span>PC</span>
            </div>
            <div v-if="scope.row.client == '1'">
              <span>移动</span>
            </div>
            <div  v-if="scope.row.client == '1,2' || scope.row.client == '2,1'">
              <span>PC,移动</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="发布人" min-width="100">
        </el-table-column>
        <el-table-column width="120" fixed="right">
          <template #header> 操作 </template>
          <template v-slot="scope">
            <el-button
              link
              size="small"
              @click="newlyEdit('编辑', scope.row)"
              >编辑</el-button
            >
            <!-- <el-button link size="small" @click="showInfoTwo(scope.row)"
              >排序</el-button
            > -->
            <el-button link size="small" @click="deleteStrip(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </section>


    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="pageTotal"
      >
      </el-pagination>
    </div>

    <el-dialog
      :title="dialog_title"
      v-model="dialogVisible"
      width="900px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          :model="formAdd"
          label-width="125px"
          :rules="form_rules"
          ref="refForm"
        >
        <el-form-item label="活动类型:" prop="huodongleixing">
            <el-select
              v-model="formAdd.huodongleixing"
              placeholder="请选择活动类型"
              @change="routineWay"
              style="width: 100%"
            >
              <el-option
                v-for="item in activity_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="平台类型:" prop="pingtaileixing">
            <el-select
              v-model="formAdd.pingtaileixing"
              placeholder="请选择平台类型"
              style="width: 100%"
              remote
              filterable
              :disabled="dialog_title=='编辑'?true:false"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="item in community_arr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动标题:" prop="huodongbiaoti">
            <el-input
              class="activity-input"
              maxlength="20"
              show-word-limit
              v-model="formAdd.huodongbiaoti"
              placeholder="请输入活动标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="详情标题:" prop="xiangqingbiaoti" v-if="formAdd.huodongleixing == 1">
            <el-input
              class="activity-input"
              maxlength="20"
              show-word-limit
              v-model="formAdd.xiangqingbiaoti"
              placeholder="请输入详情标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动时间:" prop="huodongshijian">
                <el-select v-model="formAdd.huodongshijian" placeholder="请选择活动时间" @change="timeChange" style="width: 100%">
                    <el-option label="永久上架" :value="1"></el-option>
                    <el-option label="自定义时间" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="起止时间:" prop="qizhishijian" v-if="formAdd.huodongshijian == 2">
                <el-date-picker
                    style="width: 100%;"
                    v-model="formAdd.qizhishijian"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
            </el-form-item>
          <el-form-item label="活动分类:" prop="huodongfenlei">
            <el-select
              v-model="formAdd.huodongfenlei"
              placeholder="请选择活动分类"
              multiple
              style="width: 100%"
              @change="typeWay"
            >
              <el-option
                v-for="item in activity_arr"
                :key="item.value"
                :label="item.domain"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户端:" class="activity-client" prop="clientActive">
            <el-checkbox
              v-model="item.active"
              v-for="(item, index) in formAdd.kehuduan"
              :key="index"
              @change="checkboxChange"
              >{{ item.name }}</el-checkbox
            >
          </el-form-item>
          <el-form-item label="标题图片:" prop="titlePictureActive">
            <section class="app-picture" v-if="formAdd.kehuduan[0].active">
              <p>移动</p>
              <p :style="{left: formAdd.huodongleixing == 2 ? '320px': ''}">入口图</p>
              <p v-if="formAdd.huodongleixing == 1">详情头部图</p>
              <div :class="{'sub-activity-ph': true,'variety': formAdd.huodongleixing == 2}">
                <el-upload
                  style="width: 100%; height: 100%"
                  class="avatar-uploader"
                  action=""
                  :http-request="(val)=>{uploadHttp(val,'apprukoutu')}"
                  :before-upload="beforeAvatarUpload"
                  list-link
                  :show-file-list="false"
                >
                  <i v-if="!formAdd.apprukoutu" class="el-icon-plus pen-plus"></i>
                  <img
                    v-else
                    style="
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      left: 0px;
                      top: 0px;
                    "
                    :src="formAdd.apprukoutu"
                  />
                </el-upload>
              </div>
              <div class="sub-activity-pc" v-if="formAdd.huodongleixing == 1">
                <el-upload
                  style="width: 100%; height: 100%"
                  class="avatar-uploader"
                  action=""
                  :http-request="(val)=>{uploadHttp(val,'appxiangqingtu')}"
                  :before-upload="beforeAvatarUpload"
                  list-link
                  :show-file-list="false"
                >
                  <i v-if="!formAdd.appxiangqingtu" class="el-icon-plus pen-plus"></i>
                  <img
                    v-else
                    style="
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      left: 0px;
                      top: 0px;
                    "
                    :src="formAdd.appxiangqingtu"
                  />
                </el-upload>
              </div>
            </section>
            <p class="upload-info" v-if="formAdd.kehuduan[0].active && formAdd.appPictureActive">请上传入口图和详情头部图</p>
            <section class="pc-picture" v-if="formAdd.kehuduan[1].active" :style="{ marginTop: formAdd.kehuduan[0].active ? '20px': '0px'}">
              <p>PC</p>
              <p :style="{left: formAdd.huodongleixing == 2 ? '320px': ''}">入口图</p>
              <p v-if="formAdd.huodongleixing == 1">详情头部图</p>
              <div :class="{'sub-activity-ph': true,'variety': formAdd.huodongleixing == 2}">
                <el-upload
                  style="width: 100%; height: 100%"
                  class="avatar-uploader"
                  action=""
                  :http-request="(val)=>{uploadHttp(val,'pcrukoutu')}"
                  :before-upload="beforeAvatarUpload"
                  list-link
                  :show-file-list="false"
                >
                  <i v-if="!formAdd.pcrukoutu" class="el-icon-plus pen-plus"></i>
                  <img
                    v-else
                    style="
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      left: 0px;
                      top: 0px;
                    "
                    :src="formAdd.pcrukoutu"
                  />
                </el-upload>
              </div>
              <div class="sub-activity-pc" v-if="formAdd.huodongleixing == 1">
                <el-upload
                  style="width: 100%; height: 100%"
                  class="avatar-uploader"
                  action=""
                  :http-request="(val)=>{uploadHttp(val,'pcxiangqingtu')}"
                  :before-upload="beforeAvatarUpload"
                  list-link
                  :show-file-list="false"
                >
                  <i v-if="!formAdd.pcxiangqingtu" class="el-icon-plus pen-plus"></i>
                  <img
                    v-else
                    style="
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      left: 0px;
                      top: 0px;
                    "
                    :src="formAdd.pcxiangqingtu"
                  />
                </el-upload>
              </div>
            </section>
            <p class="upload-info" v-if="formAdd.kehuduan[1].active && formAdd.pcPictureActive">请上传入口图和详情头部图</p>
          </el-form-item>
          <el-form-item label="移动详情:" prop="appEditorActive" v-show="formAdd.huodongleixing == 1 && formAdd.kehuduan[0].active">
            <vueditor ref="appbianjiqi" countIndex="app"></vueditor>
          </el-form-item>
          <el-form-item label="PC详情:" prop="pcEditorActive" v-show="formAdd.huodongleixing == 1 && formAdd.kehuduan[1].active">
            <vueditor ref="pcbianjiqi" countIndex="pc"></vueditor>
          </el-form-item>
          <el-form-item label="移动图片跳转:" prop="appurl" v-if="formAdd.kehuduan[0].active && formAdd.huodongleixing == 2">
            <el-input
              class="activity-input"
              v-model="formAdd.appurl"
              placeholder="请输入移动跳转链接"
            ></el-input>
          </el-form-item>
          <el-form-item label="PC图片跳转:" prop="pcurl" v-if="formAdd.kehuduan[1].active && formAdd.huodongleixing == 2">
            <el-input
              class="activity-input"
              v-model="formAdd.pcurl"
              placeholder="请输入PC跳转链接"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
            <el-button size="small" @click="handleClose">取 消</el-button>
            <el-button size="small" type="primary" @click="sureEvent"
            >确 定</el-button
            >
        </div>
      </template>
    </el-dialog>

    <!-- <el-dialog title="修改排序" v-model="dialogInfoTableSortNoVisible">
      <el-form :model="formAdd">
        <el-form-item label="排序值：" label-width="140px">
          <el-input placeholder="请输入排序值" type="number" v-model="sortNum">
          </el-input>
        </el-form-item>
        <el-button type="danger" v-preventReClick @click="giftCommunitySortNo()"
          >确定</el-button
        >
      </el-form>
    </el-dialog> -->
  </section>
</template>

<script>
import previewPictures from '@sky/rafaelDesign/web/components/previewPictures.vue';
// import API from "@/api/port/api";
import Sortable from 'sortablejs'
import uploadMixin from "./uploadMixin.js";
import vueditor from "./wangEditor.vue"
export default {
  name: "activityManagement",
  mixins: [uploadMixin],
  components: { vueditor, previewPictures },
  data() {
    let that = this
    var validateDe1 = (rule, value, callback) => {
      console.log("--validateDe1--", value);
      if (value && that.formAdd.kehuduan[0].active) {
        callback(new Error('请输入移动详情内容'));
      } else {
        callback();
      }
    }
    var validateDe2 = (rule, value, callback) => {
      console.log("--validateDe2--", value);
      if (value && that.formAdd.kehuduan[1].active) {
        callback(new Error('请输入PC详情内容'));
      } else {
        callback();
      }
    }
    var validateDe3 = (rule, value, callback) => {
      console.log("--validateDe3--", value);
      if (value) {
        callback(new Error('请选择客户端'));
      } else {
        callback();
      }
    }


    return {
      tab_list: [
        { name: "全部", active: true },
        { name: "PC", active: false },
        { name: "移动", active: false },
      ],
      tableData: [],
      community_arr: [],
      community_save: [],
      community_value: "",
      activity_type: [
        {
          value: 1,
          label: "常规活动",
        },
        {
          value: 2,
          label: "链接活动",
        }
      ],
      activity_arr: [
        {
          value: '1,2,3,4,5,6',
          domain: "全部",
          disabled: false
        },
        {
          value: '1',
          domain: "新人首存",
          disabled: false
        },
        {
          value: '2',
          domain: "复存",
          disabled: false
        },
        {
          value: '3',
          domain: "流水活动",
          disabled: false
        },
        {
          value: '4',
          domain: "实物",
          disabled: false
        },
        {
          value: '5',
          domain: "vip豪礼",
          disabled: false
        },
        {
          value: '6',
          domain: "其他",
          disabled: false
        }
      ],
      formAdd: {},
      saveForm: {
        huodongleixing: 1,
        pingtaileixing: "",
        huodongbiaoti: "",
        xiangqingbiaoti: "",
        huodongshijian: 1,
        qizhishijian: [],
        huodongfenlei: [],
        kehuduan: [
          { active: true, name: "移动端" },
          { active: false, name: "PC端" },
          { active: false, name: "PC热门活动" },
          { active: false, name: "PC最新活动" }
        ],
        apprukoutu: "",
        appxiangqingtu: "",
        pcrukoutu: "",
        pcxiangqingtu: "",
        appurl: "",
        pcurl: "",
        appEditorActive: false,
        pcEditorActive: false,
        clientActive: false,
        titlePictureActive: false,
        appPictureActive: false,
        pcPictureActive: false
      },
      form_rules: {
        pingtaileixing: [
          { required: true, message: "请选择平台类型", trigger: "change" }
        ],
        huodongbiaoti: [
          { required: true, message: "请输入活动标题", trigger: "blur" }
        ],
        xiangqingbiaoti: [
          { required: true, message: "请输入详情标题", trigger: "blur" }
        ],
        huodongfenlei: [
          { required: true, message: "请选择活动分类", trigger: "change" }
        ],
        qizhishijian: [
          { required: true, message: "请选择起止时间", trigger: "change" }
        ],
        appurl: [
          { required: true, message: "请输入移动跳转链接", trigger: "blur" }
        ],
        pcurl: [
          { required: true, message: "请输入PC跳转链接", trigger: "blur" }
        ],
        appEditorActive: [
          { required: true, validator: validateDe1, trigger: "change" }
        ],
        pcEditorActive: [
          { required: true, validator: validateDe2, trigger: "change" }
        ],
        clientActive: [
          { required: true, validator: validateDe3, trigger: "change" }
        ],
        titlePictureActive: [
          { required: true, message: "", trigger: "change" }
        ]
      },
      dialogVisible: false,
      dialog_title: "新增",
      platforms: "",
      // dialogInfoTableSortNoVisible: false,
      // sortNum: 0,
      // sortRow: {},
      pageSize: 10,
      pageNumber: 1,
      pageTotal: null,
      loading: true,
      saveRow: {}
    };
  },
  props: {
    tab_value: {
      type: String,
      default: "",
    },
  },
  created() {
    this.initForm();
  },
  mounted() {
    this.rowDrop();
  },
  methods: {
    routineWay(value) {
      console.log('--routineWay--', value)
      if (value == 1) {
        this.$nextTick(function(){
          if(this.dialog_title == '编辑') {
            this.editEcho(this.saveRow, value);
          }else{
            this.$refs.appbianjiqi.createEditor();
            this.$refs.pcbianjiqi.createEditor();
          }
        })
      } else {
        this.$refs.appbianjiqi.destroyWay();
        this.$refs.pcbianjiqi.destroyWay();
      }
    },
    typeWay(value) {
      console.log('--activity_arr--', value)
      if (value.indexOf("1,2,3,4,5,6") != -1) {
        this.formAdd.huodongfenlei = ["1,2,3,4,5,6"];
      }
    },
    // 拖行排序
    rowDrop () {
        console.log('----xulie----', this.$refs.xTable1)
        const tbody = this.$refs.xTable1.querySelector('.el-table__body-wrapper tbody');
        const _this = this;
        Sortable.create(tbody, {
          draggable: ".el-table__row",
          onEnd ({ newIndex, oldIndex }) {
              console.log('--paixu--', newIndex, oldIndex)
              const currRow = _this.tableData.splice(oldIndex, 1)[0];
              _this.tableData.splice(newIndex, 0, currRow);

              let idArr = _this.tableData.map(function(item){
                  return item.id
              })
              console.log('---table---', _this.tableData, idArr)
              let params = {
                  ids: idArr.join(','),
                  pageNumber: _this.pageNumber,
                  pageSize: _this.pageSize
              }
              // API.huodongSort(params).then((res) => {
                let res = {"code":200,"msg":"成功","data":null,"time":"1648744550"}
                  console.log('--sort--', res)
                  if(res.code == 200) {
                      _this.$message({
                          message: '排序成功',
                          type: 'success'
                      });
                  }
              // })
          }
      });
    },
    // 平台类型
    platformType(query = '') {
      let that = this;
      let params = {
        // gameTypeId: ''
        name: query
      }
      // API.platformType(params).then((res) => {
        let res = {"code":200,"msg":"成功","data":[{"name":"乐动游戏","id":"1395706966004727808"},{"name":"博利体育","id":"1438500174572814336"},{"name":"gogo体育","id":"1437776509266821120"},{"name":"竞博游戏","id":"1374616870304350208"},{"name":"凯发娱乐","id":"1372818256418570240"},{"name":"尊龙","id":"1372818603073601536"},{"name":"九游会","id":"1372817279049269248"},{"name":"环球体育","id":"1372817791450611712"},{"name":"易倍体育","id":"1417836871198703616"},{"name":"AOA体育","id":"1372822186175234048"},{"name":"牛宝体育","id":"1417119382361866240"},{"name":"博乐","id":"1417125421874413568"},{"name":"亚美体育","id":"1417118181641682944"},{"name":"宝博体育","id":"1411283134833491968"},{"name":"火狐体育","id":"1397555342337900544"},{"name":"贝博体育","id":"1404374541181911040"},{"name":"乐动体育","id":"1372817053446045696"},{"name":"欧洲杯","id":"1372849349125472256"},{"name":"KOK体育","id":"1372817155074031616"},{"name":"BOB体育","id":"1372816776642953216"},{"name":"天博体育","id":"1372818480851582976"},{"name":"华体会","id":"1372819702329376768"},{"name":"乐鱼体育","id":"1372817666300968960"},{"name":"NES","id":"1460114379625201664"},{"name":"嘿嘿嘿","id":"0"},{"name":"波波平台","id":"99"}],"time":"1648743020"}
        that.community_arr = [];
        for (var i = 0; i < res.data.length; i++) {
          that.community_arr.push({
            label: res.data[i].name,
            value: res.data[i].id
          });
        }
        if(!query) {
          console.log(7777777777777777, query)
          that.community_save = JSON.parse(JSON.stringify(that.community_arr))
        }
      // });
    },
    checkboxChange(value) {
      console.log('-checkboxChange-', value);
      if (this.formAdd.kehuduan[1].active && this.formAdd.kehuduan.length == 2) {
        let addArr = [
          { active: false, name: "PC热门活动" },
          { active: false, name: "PC最新活动" }
        ]
        this.formAdd.kehuduan = [ ...this.formAdd.kehuduan, ...addArr ]
      } else if (!this.formAdd.kehuduan[1].active && this.formAdd.kehuduan.length == 4) {
        this.formAdd.kehuduan = [
          this.formAdd.kehuduan[0],
          this.formAdd.kehuduan[1]
        ]
      }
    },
    initForm() {
      this.formAdd = JSON.parse(JSON.stringify(this.saveForm));
      // this.platformType('')
      this.$nextTick(function(){
        if(this.$refs.refForm) {
          this.$refs.refForm.clearValidate()
        }
      })
    },
    timeChange(value) {
        console.log('-timeChange-', value)
    },
    remoteMethod(query) {
      console.log("remote-query=", query);
      this.platformType(query)
      // this.community_arr = this.community_save.filter(function (item) {
      //   return item.label.indexOf(query) != -1;
      // });
    },
    // 确定排序
    // giftCommunitySortNo() {
    //   let msg = "确定操作吗?";
    //   this.$confirm(msg, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.sureEvent("sortNum", "", this.sortRow);
    //       this.dialogInfoTableSortNoVisible = false;
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消",
    //       });
    //     });
    // },
    // 排序
    // showInfoTwo(row) {
    //   this.sortRow = row;
    //   this.dialogInfoTableSortNoVisible = true;
    //   this.sortNum = row.sortNum;
    // },
    // 活动分类
    getHdType() {
      this.activity_arr = [];
      let params = { pageSize: 10000000, pageNumber: 1, name: "huodong" };
      API.githdTypeList(params).then((res) => {
        if (res.data != null && res.data.list.length > 0) {
          this.activity_arr = res.data.list;
        }
      });
    },
    statusChange(value, row) {
      console.log("status===", value, row);
      this.statusWay(value, row);
    },
    // 新增
    sureEvent() {
      let that = this;
      let platforms = [];
      let hotNew = [];
      for (let i = 0; i < that.formAdd.kehuduan.length; i++) {
        if (that.formAdd.kehuduan[i].active == true) {
          if(that.formAdd.kehuduan[i].name == '移动端') {
            platforms.push('1')
          }
          if(that.formAdd.kehuduan[i].name == 'PC端') {
            platforms.push('2')
          }
          if(that.formAdd.kehuduan[i].name == 'PC热门活动') {
            hotNew.push('1')
          }
          if(that.formAdd.kehuduan[i].name == 'PC最新活动') {
            hotNew.push('2')
          }
        }
      }

      if(that.formAdd.huodongleixing == 1 && !that.$refs.appbianjiqi.getContent()) {
        that.formAdd.appEditorActive = true;
      } else {
        that.formAdd.appEditorActive = false;
      }
      if (that.formAdd.huodongleixing == 1 && !that.$refs.pcbianjiqi.getContent()) {
        that.formAdd.pcEditorActive = true;
      } else {
        that.formAdd.pcEditorActive = false;
      }
      if (!platforms) {
        that.formAdd.clientActive = true;
      } else {
        that.formAdd.clientActive = false;
      }
      if ( !that.formAdd.apprukoutu || (that.formAdd.huodongleixing == 1 && !that.formAdd.appxiangqingtu)) {
        that.formAdd.appPictureActive = true
      } else {
        that.formAdd.appPictureActive = false
      }
      if ( !that.formAdd.pcrukoutu || (that.formAdd.huodongleixing == 1 && !that.formAdd.pcxiangqingtu)) {
        that.formAdd.pcPictureActive = true
      } else {
        that.formAdd.pcPictureActive = false
      }


      if (that.dialog_title == '编辑') {
        that.editSubmit(platforms, hotNew);
        return;
      }

      that.$refs.refForm.validate(function (valid) {
        if (valid) {

          let params = {
            type: that.formAdd.huodongleixing, // 活动类型：1常规活动 2.链接活动
            communityId: that.formAdd.pingtaileixing, // 平台类型:关联社区id
            activityTitle: that.formAdd.huodongbiaoti, // 活动标题
            activityTime: that.formAdd.huodongshijian, // 活动时间：1.永久上架 2.自定义时间
            activityType: that.formAdd.huodongfenlei.join(","), // 活动分类：0.全部 1.新人首存 2.复存 3.流水活动 4.实物 5.vip豪礼 6.其它
            client: platforms.join(","), // 客户端：1.移动端 2.pc端 3.pc热门活动 4.pc最新活动
            tips: hotNew.join(","), // 	pc活动：1.pc热门活动 2.pc最新活动 逗号分割
            appIndexImg: that.formAdd.apprukoutu, // 移动端入口图
            pcIndexImg: that.formAdd.pcrukoutu, // pc端入口图
            startTime: that.formAdd.qizhishijian.length != 0 ? (new Date(that.formAdd.qizhishijian[0])).getTime() / 1000 : '', // 开始时间
            endTime: that.formAdd.qizhishijian.length != 0 ? (new Date(that.formAdd.qizhishijian[1])).getTime() / 1000 : '' // 结束日期
          }
          if (that.formAdd.huodongleixing == 1) {
            let changgui = {
              detailTitle: that.formAdd.xiangqingbiaoti, // 详情标题
              appHeadImg: that.formAdd.appxiangqingtu, // 移动端详情头部图
              pcHeadImg: that.formAdd.pcxiangqingtu, // pc详情头部图
              appDetail: that.$refs.appbianjiqi.getContent(), // 移动详情
              pcDetail: that.$refs.pcbianjiqi.getContent() // PC详情
            }
            params = { ...params,  ...changgui };
          }
          if (that.formAdd.huodongleixing == 2 && that.formAdd.kehuduan[0].active) {
            let lianjie = {
              appUrl: that.formAdd.appurl // app链接
            }
            params = { ...params,  ...lianjie };
          }
          if (that.formAdd.huodongleixing == 2 && that.formAdd.kehuduan[1].active) {
            let lianjie = {
              pcUrl: that.formAdd.pcurl // pc链接
            }
            params = { ...params,  ...lianjie };
          }



          // API.newInsert(params).then((res) => {
            let res = {"code":200,"msg":"成功","data":1,"time":"1648743918"}
            if (res.code == 200) {
              that.dialogVisible = false;
              that.getJson();
              that.$message({
                type: "success",
                message: "操作成功",
              });
            } else {
              that.$message({
                type: "error",
                message: "操作失败",
              });
            }
          // });
        } else {
          return false;
        }
      });
    },
    // 编辑
    editSubmit(platforms, hotNew) {
      console.log("--编辑--");
      let that = this;
      that.$refs.refForm.validate(function (valid) {
        if (valid) {

          let params = {
            id: that.saveRow.id,
            type: that.formAdd.huodongleixing, // 活动类型：1常规活动 2.链接活动
            communityId: that.formAdd.pingtaileixing, // 平台类型:关联社区id
            activityTitle: that.formAdd.huodongbiaoti, // 活动标题
            activityTime: that.formAdd.huodongshijian, // 活动时间：1.永久上架 2.自定义时间
            activityType: that.formAdd.huodongfenlei.join(","), // 活动分类：0.全部 1.新人首存 2.复存 3.流水活动 4.实物 5.vip豪礼 6.其它
            client: platforms.join(","), // 客户端：1.移动端 2.pc端 3.pc热门活动 4.pc最新活动
            tips: hotNew.join(","), // 	pc活动：1.pc热门活动 2.pc最新活动 逗号分割
            appIndexImg: that.formAdd.apprukoutu, // 移动端入口图
            pcIndexImg: that.formAdd.pcrukoutu, // pc端入口图
            startTime: that.formAdd.qizhishijian.length != 0 ? (new Date(that.formAdd.qizhishijian[0])).getTime() / 1000 : '', // 开始时间
            endTime: that.formAdd.qizhishijian.length != 0 ? (new Date(that.formAdd.qizhishijian[1])).getTime() / 1000 : '' // 结束日期
          }
          if (that.formAdd.huodongleixing == 1) {
            let changgui = {
              detailTitle: that.formAdd.xiangqingbiaoti, // 详情标题
              appHeadImg: that.formAdd.appxiangqingtu, // 移动端详情头部图
              pcHeadImg: that.formAdd.pcxiangqingtu, // pc详情头部图
              appDetail: that.$refs.appbianjiqi.getContent(), // 移动详情
              pcDetail: that.$refs.pcbianjiqi.getContent() // PC详情
            }
            params = { ...params,  ...changgui };
          }
          if (that.formAdd.huodongleixing == 2 && that.formAdd.kehuduan[0].active) {
            let lianjie = {
              appUrl: that.formAdd.appurl // app链接
            }
            params = { ...params,  ...lianjie };
          }
          if (that.formAdd.huodongleixing == 2 && that.formAdd.kehuduan[1].active) {
            let lianjie = {
              pcUrl: that.formAdd.pcurl // pc链接
            }
            params = { ...params,  ...lianjie };
          }

          // API.newUpdate(params).then((res) => {
            let res = {"code":200,"msg":"成功","data":1,"time":"1648744111"}
            if (res.code == 200) {
              that.dialogVisible = false;
              that.getJson();
              that.$message({
                type: "success",
                message: "操作成功",
              });
            } else {
              that.$message({
                type: "error",
                message: "操作失败",
              });
            }
          // });

        } else {
          return false;
        }
      });
    },
    statusWay(value, row) {
      console.log('--statusWay--', value, row)
      let that = this;
      let params = {
        id: row.id,
        status: value ? 1 : 0
      }
      API.newUpdate(params).then((res) => {
        if (res.code == 200) {
          that.getJson();
          that.$message({
            type: "success",
            message: "修改成功",
          });
        } else {
          that.$message({
            type: "error",
            message: "操作失败",
          });
        }
      });
    },
    changeCommunity(value) {
      console.log("changeCommunity", value);
    },
    // 列表
    getJson(type) {
      console.log("ty==", type);
      let that = this;
      this.loading = true;
      let param = {
        communityId: that.community_value,
        activityType: that.tab_value,
        client: that.platforms,
        pageNumber: that.pageNumber,
        pageSize: that.pageSize,
      };
      // API.newActiveList(param).then((res) => {
        let res = {"code":200,"msg":"成功","data":{"total":"8","list":[{"id":"141155986315546624","activityNo":"nqlrb7g2","type":1,"communityId":"1372818256418570240","communityName":"凯发娱乐","url":null,"websiteUrl":null,"logoUrl":null,"customerUrl":null,"activityTitle":"哒哒哒","detailTitle":"帆帆活动","activityTime":1,"startTime":"","endTime":"","activityType":"5","client":"1,2","tips":"","appIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1643113324990284215.jpg","appHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1643113329019270430.jpg","pcIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1643113594496028435.jpg","pcHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1643113605794676808.jpg","appDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>都</th><th>分</th></tr><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><ol><li>酷酷酷</li><li>喀喀喀的</li></ol>","pcDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>的</th><th>对</th><th>都</th></tr><tr><td>1</td><td>2</td><td>3</td></tr></tbody></table><ol><li>dd放大</li><li>卡卡思考</li></ol>","appUrl":null,"pcUrl":null,"sort":11,"status":1,"createUser":"admin","createTime":"1643113409","updateTime":"1643441997"},{"id":"141069933537792000","activityNo":"jdjhrt67","type":1,"communityId":"1372818379970183168","communityName":"博天堂","url":null,"websiteUrl":null,"logoUrl":null,"customerUrl":null,"activityTitle":"szdxc","detailTitle":"aszdxc","activityTime":1,"startTime":"","endTime":"","activityType":"6","client":"1","tips":"","appIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1643092882778538362.jpg","appHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1643092886792410723.jpeg","pcIndexImg":"","pcHeadImg":"","appDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>7</th><th>7</th><th>7</th></tr><tr><td>7</td><td>7</td><td>7</td></tr><tr><td>8</td><td>8</td><td>8</td></tr></tbody></table><p>活动规则：</p><table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th><p>活动规则：</p><p>1.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流</p></th></tr></tbody></table><p><br/></p><p>1.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流</p><p>2.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>3.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>4.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>5.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>6.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>7.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>8.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p>","pcDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>8</th><th>8</th><th>8</th></tr><tr><td>8</td><td>8</td><td>8</td></tr><tr><td>9</td><td>9</td><td>9</td></tr></tbody></table><p>活动规则：</p><p>1.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流</p><p>2.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>3.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>4.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>5.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>6.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>7.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>8.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流</p><table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th></th></tr></tbody></table><table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th></th></tr></tbody></table>","appUrl":null,"pcUrl":null,"sort":11,"status":1,"createUser":"admin","createTime":"1643092893","updateTime":"1643109959"},{"id":"141069807503151104","activityNo":"gggpm0ke","type":1,"communityId":"1372818379970183168","communityName":"博天堂","url":null,"websiteUrl":null,"logoUrl":null,"customerUrl":null,"activityTitle":"dfg","detailTitle":"sc","activityTime":1,"startTime":"","endTime":"","activityType":"3,4,5,6","client":"1","tips":"","appIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1643092858114535459.png","appHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1643092860649380362.jpeg","pcIndexImg":"","pcHeadImg":"","appDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>5</th><th>5</th><th>5</th></tr><tr><td>5</td><td>5</td><td>5</td></tr></tbody></table><p>yhkdytkthxfh恐惧八卦江湖v好几次v和顾客城管局地方发v从vbvc</p>","pcDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>6</th><th>6</th><th>6</th></tr><tr><td>6</td><td>6</td><td>6</td></tr></tbody></table><p>高蛋白VS不会犯错被对方不存在的反驳对方 岁的妇女国防部电饭煲电饭煲feds发布会的最根本的而发生公司的人发表&nbsp;</p>","appUrl":null,"pcUrl":null,"sort":11,"status":1,"createUser":"admin","createTime":"1643092863","updateTime":"1643113474"},{"id":"141069675604873216","activityNo":"vtvyutxh","type":1,"communityId":"1372818379970183168","communityName":"博天堂","url":null,"websiteUrl":null,"logoUrl":null,"customerUrl":null,"activityTitle":"x","detailTitle":"x","activityTime":1,"startTime":"","endTime":"","activityType":"1,2,3,4,5,6","client":"1,2","tips":"","appIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1643092812066666951.jpeg","appHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1643092816097544715.gif","pcIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1643092820434434304.jpg","pcHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1643092827645690418.jpeg","appDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>7</th><th>7</th><th>7</th></tr><tr><td>7</td><td>7</td><td>7</td></tr><tr><td>8</td><td>8</td><td>8</td></tr></tbody></table><p>活动规则：</p><table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th><p>活动规则：</p><p>1.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流</p></th></tr></tbody></table><ol><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>2222222222222222222222222222222222222</li><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>2222222222222222222222222222222222222</li><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>2222222222222222222222222222222222222</li><li>2222222222222222222222222222222222222<br/><br/></li></ol><p>1.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流</p><p>2.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>3.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>4.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>5.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>6.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>7.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>8.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p>","pcDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>8</th><th>8</th><th>8</th></tr><tr><td>8</td><td>8</td><td>8</td></tr><tr><td>9</td><td>9</td><td>9</td></tr></tbody></table><p>活动规则：</p><ol><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>2222222222222222222222222222222222222</li><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>2222222222222222222222222222222222222</li><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>2222222222222222222222222222222222222</li><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>2222222222222222222222222222222222222</li><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>1风高放火发挥好方法符合合格后干活干活干活干活</li><li>2222222222222222222222222222222222222</li><li>2222222222222222222222222222222222222</li><li>2222222222222222222222222222222222222<br/><br/></li></ol><p>1.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流</p><p>2.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>3.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>4.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>5.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>6.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>7.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流<br/></p><p>8.就看哈呵呵上大课拉过来看过了的开始健康垃圾链接的拉升股价的噶交流</p><p><br/></p><p><br/></p>","appUrl":null,"pcUrl":null,"sort":12,"status":1,"createUser":"admin","createTime":"1643092831","updateTime":"1643181748"},{"id":"140474630988238848","activityNo":"f785vcht","type":1,"communityId":"1438500174572814336","communityName":"博利体育","url":null,"websiteUrl":null,"logoUrl":null,"customerUrl":null,"activityTitle":"常规1哈哈哈常规1哈哈哈常规1哈哈哈","detailTitle":"常规1","activityTime":2,"startTime":"1642809600","endTime":"1642896000","activityType":"1","client":"1,2","tips":"1,2","appIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1642950946919634800.png","appHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1642950948275673745.jpeg","pcIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1642950951563558155.jpg","pcHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1642950956307728054.jpg","appDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>在</th><th>在</th><th>在</th></tr><tr><td>2</td><td>2</td><td>2</td></tr></tbody></table>","pcDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>从</th><th>从</th><th>从</th></tr><tr><td>3</td><td>3</td><td>3</td></tr></tbody></table>","appUrl":null,"pcUrl":null,"sort":13,"status":1,"createUser":"admin","createTime":"1642950961","updateTime":"1643042420"},{"id":"140441064568918016","activityNo":"g05pul0a","type":1,"communityId":"99","communityName":"波波平台","url":null,"websiteUrl":null,"logoUrl":null,"customerUrl":null,"activityTitle":"常规新人首存","detailTitle":"常规新人首存","activityTime":1,"startTime":"","endTime":"","activityType":"1,2,3,4,5","client":"1,2","tips":"","appIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1642942930529539969.png","appHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1642942935930669248.jpeg","pcIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1642942941729371448.jpeg","pcHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1642942948896453706.jpg","appDetail":"<p><br/></p><p><br/></p><table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th></th><th></th><th></th></tr><tr><td>5</td><td>5</td><td>5</td></tr></tbody></table>","pcDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th></th><th></th><th></th></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>3</td><td>3</td><td>3</td></tr></tbody></table>","appUrl":null,"pcUrl":null,"sort":13,"status":1,"createUser":"admin","createTime":"1642942959","updateTime":"1643020514"},{"id":"140832233102643200","activityNo":"96al2tb7","type":1,"communityId":"99","communityName":"波波平台","url":null,"websiteUrl":null,"logoUrl":null,"customerUrl":null,"activityTitle":"标题测试1","detailTitle":"详情标题测试1","activityTime":1,"startTime":"","endTime":"","activityType":"1,2,3,4,5,6","client":"1,2","tips":"","appIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1643036189543321753.jpg","appHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1643036191885850689.jpg","pcIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1643036194549087908.jpg","pcHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1643036198152759823.jpg","appDetail":"<p>所发生的</p>","pcDetail":"<p>是否是</p>","appUrl":null,"pcUrl":null,"sort":14,"status":1,"createUser":"admin","createTime":"1643036220","updateTime":"1643094656"},{"id":"140365383814221824","activityNo":"z530wol2","type":2,"communityId":"1406980188754935808","communityName":"赌聊","url":null,"websiteUrl":null,"logoUrl":null,"customerUrl":null,"activityTitle":"链接2","detailTitle":null,"activityTime":1,"startTime":"","endTime":"","activityType":"1,5","client":"1,2","tips":"1,2","appIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1642924897235613052.jpg","appHeadImg":null,"pcIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1642924904949539363.jpg","pcHeadImg":null,"appDetail":null,"pcDetail":null,"appUrl":"https://www.baidu.com","pcUrl":"https://www.baidu1.com","sort":15,"status":1,"createUser":"admin","createTime":"1642924915","updateTime":"1643031242"}],"pageNum":1,"pageSize":10,"size":8,"startRow":"1","endRow":"8","pages":1,"prePage":0,"nextPage":0,"isFirstPage":true,"isLastPage":true,"hasPreviousPage":false,"hasNextPage":false,"navigatePages":8,"navigatepageNums":[1],"navigateFirstPage":1,"navigateLastPage":1},"time":"1648743020"}
        this.loading = false;
        if (res.code == 200) {
          that.tableData = res.data.list;
          that.pageTotal = parseInt(res.data.total);
          for (let i = 0; i < that.tableData.length; i++) {
            if (that.tableData[i].status == 1) {
              that.tableData[i].status = true;
            } else {
              that.tableData[i].status = false;
            }

            if(that.tableData[i].activityTime == 1) {
              that.tableData[i].isTime = '永久上架';
            } else if (that.tableData[i].activityTime == 2) {
              that.tableData[i].isTime = (that.tableData[i].startTime&&that.tableData[i].endTime) ? that.timeTransformation(that.tableData[i].startTime) + ' ~ ' + that.timeTransformation(that.tableData[i].endTime) : ''
            }
          }
        } else {
          that.$message({
            type: "error",
            message: "操作失败",
          });
        }
      // });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNumber = 1;
      this.getJson();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNumber = val;
      this.getJson();
    },
    // 删除
    deleteStrip(item) {
      console.log("item=", item);
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let param = {
            id: item.id
          };

          // API.deleteActiveJson(param).then((res) => {
            let res = {"code":200,"msg":"成功","data":1,"time":"1648744223"}
            if (res.code == 200) {
              this.getJson();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            }
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleClose() {
      console.log('--handleClose--')
      this.$refs.appbianjiqi.destroyWay();
      this.$refs.pcbianjiqi.destroyWay();
      this.dialogVisible = false;
    },
    switchingEquipment(index) {
      for (let i = 0; i < this.tab_list.length; i++) {
        this.tab_list[i].active = false;
      }
      this.tab_list[index].active = true;
      if (index == 0) {
        this.platforms = "";
      } else if (index == 1) {
        this.platforms = '2';
      } else if (index == 2) {
        this.platforms = '1';
      }
      this.getJson();
    },
    newlyEdit(title, row) {
      this.dialog_title = title;
      this.dialogVisible = true;
      console.log('---平台类型---', this.community_save)
      this.community_arr = JSON.parse(JSON.stringify(this.community_save))
      if (title == "新增") {
        this.initForm();
        this.formAdd.kehuduan = [
          { active: true, name: "移动端" },
          { active: false, name: "PC端" }
        ]
        this.$nextTick(function(){
          this.$refs.appbianjiqi.createEditor();
          this.$refs.pcbianjiqi.createEditor();
        })
      } else if (title == "编辑") {
        this.saveRow = row
        this.editEcho(this.saveRow)
      }
      console.log("row--", row);

    },
    // 编辑详情
    editEcho(row, setType) {
      let that = this;
      let params = {
        id: row.id
      }
      // API.editDetails(params).then((res) => {
        let res = {"code":200,"msg":"成功","data":{"id":"140474630988238848","activityNo":"f785vcht","type":1,"communityId":"1438500174572814336","communityName":null,"url":null,"websiteUrl":null,"logoUrl":null,"customerUrl":null,"activityTitle":"常规1哈哈哈常规1哈哈哈常规1哈哈哈","detailTitle":"常规1","activityTime":2,"startTime":"1642809600","endTime":"1642896000","activityType":"1","client":"1,2","tips":"1,2","appIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1642950946919634800.png","appHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1642950948275673745.jpeg","pcIndexImg":"http://oss.bobovip2.com/bobo/2022/01/1642950951563558155.jpg","pcHeadImg":"http://oss.bobovip2.com/bobo/2022/01/1642950956307728054.jpg","appDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>在</th><th>在</th><th>在</th></tr><tr><td>2</td><td>2</td><td>2</td></tr></tbody></table>","pcDetail":"<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><th>从</th><th>从</th><th>从</th></tr><tr><td>3</td><td>3</td><td>3</td></tr></tbody></table>","appUrl":null,"pcUrl":null,"sort":15,"status":1,"createUser":"admin","createTime":"1642950961","updateTime":"1643042420"},"time":"1648745649"}
        that.formAdd.huodongleixing = setType ? setType : res.data.type
        that.formAdd.pingtaileixing = res.data.communityId
        that.formAdd.huodongbiaoti = res.data.activityTitle
        that.formAdd.xiangqingbiaoti = res.data.detailTitle
        that.formAdd.huodongshijian = res.data.activityTime
        if (res.data.activityType == "1,2,3,4,5,6") {
          that.formAdd.huodongfenlei = ["1,2,3,4,5,6"];
        } else {
          that.formAdd.huodongfenlei = res.data.activityType.split(",");
        }
        that.formAdd.apprukoutu = res.data.appIndexImg
        that.formAdd.appxiangqingtu = res.data.appHeadImg
        that.formAdd.pcrukoutu = res.data.pcIndexImg
        that.formAdd.pcxiangqingtu = res.data.pcHeadImg
        that.formAdd.appurl = res.data.appUrl
        that.formAdd.pcurl = res.data.pcUrl
        that.formAdd.qizhishijian = (res.data.startTime&&res.data.endTime) ? [that.timeTransformation(res.data.startTime),that.timeTransformation(res.data.endTime)] : []

        if(res.data.client == '1,2' || res.data.client == '2,1' || res.data.client == '2') {
          that.formAdd.kehuduan = [
            { active: true, name: "移动端" },
            { active: true, name: "PC端" },
            { active: false, name: "PC热门活动" },
            { active: false, name: "PC最新活动" }
          ]
          if(res.data.client == '2') {
            that.formAdd.kehuduan[0].active = false;
          }
          if (res.data.tips == '1') {
            that.formAdd.kehuduan[2].active = true;
          } else if (res.data.tips == '2') {
            that.formAdd.kehuduan[3].active = true;
          } else if (res.data.tips == '1,2' || res.data.tips == '2,1') {
            that.formAdd.kehuduan[2].active = true;
            that.formAdd.kehuduan[3].active = true;
          }
        } else if (res.data.client == '1') {
          that.formAdd.kehuduan = [
            { active: true, name: "移动端" },
            { active: false, name: "PC端" }
          ]
        }
        if(that.formAdd.huodongleixing == 1) {
          that.$nextTick(function(){
            that.$refs.appbianjiqi.createEditor();
            that.$refs.pcbianjiqi.createEditor();
            that.$refs.appbianjiqi.setContent(res.data.appDetail)
            that.$refs.pcbianjiqi.setContent(res.data.pcDetail)
          })
        }


      // });
    },
    timeTransformation(time) {
        let date = new Date(time*1000);
        let YY = date.getFullYear() + '-';
        let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        // let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        // let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        // let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return YY + MM + DD
    }
  }
};
</script>

<style lang="scss" scoped>
.all-activities {
  width: 100%;
  height: 100%;
  .header-info {
    width: 100%;
    height: 50px;
    .newly-build {
      float: left;
    }
    ul {
      height: 30px;
      float: left;
      margin-left: 50px;
      border-collapse: collapse;
      li {
        width: 65px;
        height: 30px;
        line-height: 30px;
        float: left;
        list-style: none;
        color: #333333;
        font-size: 13px;
        font-family: "Arial Normal", "Arial", sans-serif;
        font-weight: 400;
        border: 1px solid rgba(215, 215, 215, 1);
        cursor: pointer;
        text-align: center;
      }
      .active-li {
        border: 1px solid rgba(45, 140, 240, 1);
        color: #ffffff;
        background-color: rgba(64, 157, 254, 1);
      }
    }
    .search-content {
      float: right;
      margin-left: 10px;
    }
    .choose-community {
      float: right;
    }
  }
  .page-box {
    height: 50px;
    padding: 18px 0 0 0;
    box-sizing: border-box;
  }
  .activity-client label {
    float: left;
  }
  .upload-info {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #F56C6C;
  }
  .app-picture, .pc-picture {
    width: 100%;
    height: 180px;
    padding: 46px 20px 20px 20px;
    box-sizing: border-box;
    border: 1px solid #D7D7D7;
    position: relative;
    .sub-activity-ph,
    .sub-activity-pc {
      width: 40%;
      height: 107px;
      color: rgb(170, 170, 170);
      border: 1px solid rgb(215, 215, 215);
      float: left;
      position: relative;
      :deep(.el-upload) {
        width: 100%;
        height: 100%;
        position: relative;
      }
      :deep(.el-upload-dragger) {
        width: 100%;
        height: 100%;
      }
      .pen-plus {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 2;
        font-size: 25px;
        margin-left: -12.5px;
        margin-top: -12.5px;
      }
    }
    .sub-activity-pc {
      float: right;
    }
    .variety {
      margin-left: 190px;
    }
    p:nth-of-type(1) {
      padding: 0 20px;
      box-sizing: border-box;
      height: 21px;
      line-height: 21px;
      color: #F2F2F2;
      background: #AAAAAA;
      font-size: 14px;
      position: absolute;
      left: 0px;
      top: 0px;
    }
    p:nth-of-type(2) {
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      position: absolute;
      left: 130px;
      top: 25px;
    }
    p:nth-of-type(3) {
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      position: absolute;
      right: 120px;
      top: 25px;
    }
  }
  :deep(.el-dialog__body) {
    padding: 30px 80px 30px 20px;
  }
  .activity-input {
    -height: 35px;
  }
  .table-box {
      width: 100%;
      height: calc(100% - 100px);
      overflow: auto;
  }
  :deep(.el-select .el-input .el-icon-::before) {
    content: "\e6e1";
    transform: rotate(180deg);
  }

  :deep(.el-select .el-input.is-focus .el-icon-) {
    transform: rotate(0deg);
  }

  td {
    position: relative;
  }
  .endearment {
    width: 100%;
    height: 100%;
    padding: 15px 0 15px 0;
    .remen {
      width: 35px;
      height: 15px;
      line-height: 15px;
      color: #fff;
      border-radius: 4px;
      text-align: center;
      font-size: 10px;
      position: absolute;
      left: 1px;
      top: 1px;
      background: #fab6b6;
    }
    .zuixin {
      width: 35px;
      height: 15px;
      line-height: 15px;
      color: #fff;
      border-radius: 4px;
      text-align: center;
      font-size: 10px;
      position: absolute;
      left: 41px;
      top: 1px;
      background: #a0cfff;
    }
  }
}
</style>


