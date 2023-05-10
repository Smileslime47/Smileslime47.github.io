解题思路

对于原本的代码，我们通过一个for(int i:time)循环来实现，并在循环内不断更新cnt，其中**增强型for不断遍历time中的元素**，这一点可以通过Kotlin中数组的**聚合函数**fold实现
- **聚合**是指对一个集合（如数组等）进行遍历，并更新一个返回值的操作，如max()函数等

对于Kotlin，`fold(initial: R, operation: (acc: R, Int) -> R)`接受一个initial变量和一个lambda，其中lambda的参数固定为一个acc变量和一个int变量

前者初始化为initial的值并被传入lambda，后者用于遍历数组中的元素

lambda的返回值被用于更新acc变量，同时fold函数本身返回更新完毕后的acc，我们可以写一个简化的伪代码例子：

```java
//这里是一种柯里化的写法，即fold(initial,operation)等价于fold(initial)(operation)
array.fold(0){acc,i->
    ...
}
```

这个代码等价于
```java
var acc=0
for(i in array){
    acc=xxx(cnt,i)
}

//其中R为数组元素类型
fun xxx(a:Int,b:R):R{
    ...
    return xxx
}
```

我们传入一个map:IntArray(61)，其中多出来的map[60]为cnt

我们遍历数组中的元素，用i指代，对其进行操作后再将map返回，最后将得到的数组[60]返回即可

```java
class Solution {
    fun numPairsDivisibleBy60(time: IntArray): Int {
        return time.fold((IntArray(61){0})){map,i->
            map[60]+=if(i%60==0)
                map[0]
            else if(map[60-(i%60)]>0)
                map[60-(i%60)]
            else 
                0
            map[i%60]++
            map
        }[60]
    }
}
```
