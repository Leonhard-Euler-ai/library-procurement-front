#### 记录
1. store中state的使用
```js
import { mapGetters } from 'vuex'

computed: {
    ...mapGetters([
      'name'
    ])
  }
```
2. table
```html
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
```