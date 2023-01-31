# original_mipi_init_sequence-to-rk_dts_panel_init_sequence-convert
 用于将厂家给的mipi屏初始化代码转换为RK系列的dts文件的panel-init-sequence。

# 效果
例：将DTS数据:
```
SSD_CMD(0x30);
SSD_PAR(0x01);

SSD_CMD(0x78);
SSD_PAR(0x49);
SSD_PAR(0x61);
SSD_PAR(0x02);
SSD_PAR(0x00);

SSD_CMD(0x29);
Delayms(50);
```

转换为RK数据:
```
15 00 30 01 01
39 00 78 05 49 61 02 00
05 32 01 29
```

数据格式参考 https://blog.csdn.net/qq_38312843/article/details/107534743

# 用法
  1. 在 [releases](https://github.com/Giftia/Lapelo/releases) 获取最新的压缩包，下载到本地并解压。
  2. 将厂家给的mipi屏初始化代码复制到 `mipi_init_sequence.txt` 文件中。
  3. 运行 `original_mipi_init_sequence-to-rk_dts_panel_init_sequence-convert.exe` 。
  4. 将生成的 `panel-init-sequence.txt` 里的数据复制到你屏幕dts文件中的 `panel-init-sequence` 。
