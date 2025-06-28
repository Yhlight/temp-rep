// 此js文件旨在实现JavaScript模块加载器
// 对于这种对象模块框架，若不借助ES6的模块功能，很难处理JS文件加载顺序问题
// (然而JS ES6的模块本身设计就是一个妥协的产物，注定了这个模块这个功能不会那么尽人意)
// 尽管现成有很多的框架高度实现了独特的加载器，但自己手写实现一个加载器也是一种选择
// 此模块加载器仿造AMD模块加载器而实现
// (我还不具备有手搓的能力，此加载器一定程度上借助了AI)

// 此模块加载器支持如下功能
// 解决模块之间相互引用导致的加载顺序问题，自动管理模块的加载顺序，让js文件可以无序载入
// 更直观地看到各模块之间的依赖关系，并能够处理依赖循环引用问题

((window) => {
    const Louder = {
        // 用于缓存已定义的模块，避免重复注册
        modules: {},

        /**
         * 定义模块
         * @param {string} name - 模块名称
         * @param {Array<string>} deps - 模块的依赖
         * @param {Function} factory - 模块的工厂函数，用于初始化模块
         */
        define: function (name, deps, factory) {
            if (this.modules[name]) return;

            this.modules[name] = {
                // deps  ->  模块的依赖
                deps,

                // factory  ->  模块的工厂函数，用于初始化模块
                factory,

                // exports  ->  导出对象，实现模块之间的互联的关键，即模块对外暴露的接口
                exports: {},

                // initialized  ->  模块是否初始化
                initialized: false,
            };
        },

        /**
         * 加载并初始化模块
         * 支持循环依赖，执行模块工厂函数并返回模块导出对象
         * @param {string} name - 要加载的模块名称
         * @returns {*} exports - 模块的导出对象
         */
        require: function (name) {
            const mod = this.modules[name];
            if (!mod) throw new Error(`模块${name}未定义`);
            if (mod.initialized) return mod.exports;

            mod.initialized = true;

            // 模块依赖的导出结果
            const depExports = mod.deps.map(dep => {
                // 注入require()函数，此举是为了动态加载模块或解决循环引用问题
                // 使用define()函数定义模块时，若存在需要手动加载模块或存在循环引用问题时，必须包含require依赖
                // 注意，require依赖仅需要一方拥有即可，其他方无需重复包含，因此被引用次数最多的模块是最优解
                if (dep === "require") return this.require;
                // 注入当前模块的导出对象
                // 使用define()函数定义模块时，需要向外暴露的模块必须包含有exports依赖
                // require与exports的使用是一种准则
                if (dep === "exports") return mod.exports;
                // 注入当前模块注册信息
                if (dep === "module") return mod;
                // 递归加载其他依赖模块
                return this.require(dep);
            });

            // 执行工厂函数，传入模块依赖的导出结果
            mod.factory.apply(null, depExports);

            return mod.exports;
        }
    }

    window.Louder = Louder;
})(window);