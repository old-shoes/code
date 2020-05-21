一行内超出点点点

```css
overflow:hidden; /*超出的部分隐藏起来。*/ 
white-space:nowrap;/*不显示的地方用省略号...代替*/
text-overflow:ellipsis;/* 支持 IE */
```



超出两行显示点点点

```css
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
```

鼠标变手

```css
  cursor:pointer;
  -ms-cursor:hand;
```

强制断句
css的 word-wrap 属性用来标明是否允许浏览器在单词内进行断句，这是为了防止当一个字符串太长而找不到它的自然断句点时产生溢出现象。
word-break:break-all不管是否在单词内部强制断句

```css
word-wrap: break-word;
word-break:break-all;
```

取消chrome下textarea可拖动放大：

```css
textarea{resize:none}
```

