import{_ as s,o as n,c as a,a as e}from"./app.2bb708a3.js";const A=JSON.parse('{"title":"Kotlin\u5728MybatisPlus\u4E2D\u4F7F\u7528EasyCode\u6A21\u677F","description":"","frontmatter":{},"headers":[{"level":2,"title":"Entity","slug":"entity","link":"#entity","children":[]},{"level":2,"title":"Mapper","slug":"mapper","link":"#mapper","children":[]},{"level":2,"title":"Service","slug":"service","link":"#service","children":[]},{"level":2,"title":"ServiceImpl","slug":"serviceimpl","link":"#serviceimpl","children":[]}],"relativePath":"Kotlin/Kotlin \u5F00\u53D1\u968F\u8BB0/Kotlin\u5728MybatisPlus\u4E2D\u4F7F\u7528EasyCode\u6A21\u677F.md"}'),l={name:"Kotlin/Kotlin \u5F00\u53D1\u968F\u8BB0/Kotlin\u5728MybatisPlus\u4E2D\u4F7F\u7528EasyCode\u6A21\u677F.md"},p=e(`<h1 id="kotlin\u5728mybatisplus\u4E2D\u4F7F\u7528easycode\u6A21\u677F" tabindex="-1">Kotlin\u5728MybatisPlus\u4E2D\u4F7F\u7528EasyCode\u6A21\u677F <a class="header-anchor" href="#kotlin\u5728mybatisplus\u4E2D\u4F7F\u7528easycode\u6A21\u677F" aria-hidden="true">#</a></h1><p>Easy Code\u9ED8\u8BA4\u53EA\u63D0\u4F9B\u4E86JAVA\u7684MybatisPlus\u76F8\u5173\u7684\u6A21\u677F\uFF0C\u8FD9\u91CC\u63D0\u4F9B\u4E00\u4E0BKotlin\u7684\u6A21\u677F\uFF0C\u751F\u6210\u7684\u65F6\u5019\u53EF\u4EE5\u66F4\u52A0\u65B9\u4FBF</p><h2 id="entity" tabindex="-1">Entity <a class="header-anchor" href="#entity" aria-hidden="true">#</a></h2><div class="language- line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">##\u5BFC\u5165\u5B8F\u5B9A\u4E49</span></span>
<span class="line"><span style="color:#A6ACCD;">$!{define.vm}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u4FDD\u5B58\u6587\u4EF6\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#save(&quot;/entity&quot;, &quot;.kt&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u5305\u8DEF\u5F84\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#setPackageSuffix(&quot;entity&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u81EA\u52A8\u5BFC\u5165\u5305\uFF08\u5168\u5C40\u53D8\u91CF\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">$!{autoImport.vm}</span></span>
<span class="line"><span style="color:#A6ACCD;">import com.baomidou.mybatisplus.annotation.TableId</span></span>
<span class="line"><span style="color:#A6ACCD;">import com.baomidou.mybatisplus.annotation.TableName</span></span>
<span class="line"><span style="color:#A6ACCD;">import java.util.*</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u8868\u6CE8\u91CA\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#tableComment(&quot;\u8868\u5B9E\u4F53\u7C7B&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">@TableName(&quot;$!{tableInfo.name}&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">data class $!{tableInfo.name}(</span></span>
<span class="line"><span style="color:#A6ACCD;">#foreach($column in $tableInfo.fullColumn)</span></span>
<span class="line"><span style="color:#A6ACCD;">    #if(\${column.comment})//\${column.comment}#end</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    var $!{column.name}: $!{tool.getClsNameByFullName($column.type)}? = null,</span></span>
<span class="line"><span style="color:#A6ACCD;">#end</span></span>
<span class="line"><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h2 id="mapper" tabindex="-1">Mapper <a class="header-anchor" href="#mapper" aria-hidden="true">#</a></h2><div class="language- line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">##\u5BFC\u5165\u5B8F\u5B9A\u4E49</span></span>
<span class="line"><span style="color:#A6ACCD;">$!{define.vm}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u8BBE\u7F6E\u8868\u540E\u7F00\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#setTableSuffix(&quot;Mapper&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u4FDD\u5B58\u6587\u4EF6\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#save(&quot;/mapper&quot;, &quot;Mapper.kt&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u5305\u8DEF\u5F84\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#setPackageSuffix(&quot;mapper&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">import com.baomidou.mybatisplus.core.mapper.BaseMapper;</span></span>
<span class="line"><span style="color:#A6ACCD;">import $!{tableInfo.savePackageName}.entity.$!tableInfo.name;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u8868\u6CE8\u91CA\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#tableComment(&quot;\u8868\u6570\u636E\u5E93\u8BBF\u95EE\u5C42&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">interface $!{tableName} : BaseMapper&lt;$!tableInfo.name&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h2 id="service" tabindex="-1">Service <a class="header-anchor" href="#service" aria-hidden="true">#</a></h2><div class="language- line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">##\u5BFC\u5165\u5B8F\u5B9A\u4E49</span></span>
<span class="line"><span style="color:#A6ACCD;">$!{define.vm}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u8BBE\u7F6E\u8868\u540E\u7F00\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#setTableSuffix(&quot;Service&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u4FDD\u5B58\u6587\u4EF6\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#save(&quot;/service&quot;, &quot;Service.kt&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u5305\u8DEF\u5F84\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#setPackageSuffix(&quot;service&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">import com.baomidou.mybatisplus.extension.service.IService;</span></span>
<span class="line"><span style="color:#A6ACCD;">import $!{tableInfo.savePackageName}.entity.$!tableInfo.name;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u8868\u6CE8\u91CA\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#tableComment(&quot;\u8868\u670D\u52A1\u63A5\u53E3&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">interface $!{tableName} : IService&lt;$!tableInfo.name&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h2 id="serviceimpl" tabindex="-1">ServiceImpl <a class="header-anchor" href="#serviceimpl" aria-hidden="true">#</a></h2><div class="language- line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">##\u5BFC\u5165\u5B8F\u5B9A\u4E49</span></span>
<span class="line"><span style="color:#A6ACCD;">$!{define.vm}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u8BBE\u7F6E\u8868\u540E\u7F00\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#setTableSuffix(&quot;ServiceImpl&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u4FDD\u5B58\u6587\u4EF6\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#save(&quot;/service/impl&quot;, &quot;ServiceImpl.kt&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u5305\u8DEF\u5F84\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#setPackageSuffix(&quot;service.impl&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;</span></span>
<span class="line"><span style="color:#A6ACCD;">import $!{tableInfo.savePackageName}.dao.$!{tableInfo.name}Dao;</span></span>
<span class="line"><span style="color:#A6ACCD;">import $!{tableInfo.savePackageName}.entity.$!{tableInfo.name};</span></span>
<span class="line"><span style="color:#A6ACCD;">import $!{tableInfo.savePackageName}.service.$!{tableInfo.name}Service;</span></span>
<span class="line"><span style="color:#A6ACCD;">import org.springframework.stereotype.Service;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">##\u8868\u6CE8\u91CA\uFF08\u5B8F\u5B9A\u4E49\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">#tableComment(&quot;\u8868\u670D\u52A1\u5B9E\u73B0\u7C7B&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">@Service(&quot;$!tool.firstLowerCase($tableInfo.name)Service&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">class $!{tableName} :  ServiceImpl&lt;$!{tableInfo.name}Mapper, $!{tableInfo.name}&gt;(), $!{tableInfo.name}Service</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div>`,10),r=[p];function c(o,i,t,b,m,C){return n(),a("div",null,r)}const y=s(l,[["render",c]]);export{A as __pageData,y as default};
