class JVBreakpoints {

    constructor() {

        this.xsMin = 0;
        this.xsMax = 575;

        this.smMin = this.xsMax + 1;
        this.smMax = 767;

        this.mdMin = this.smMax + 1;
        this.mdMax = 991;

        this.lgMin = this.mdMax + 1;
        this.lgMax = 1199;

        this.xlMin = this.lgMax + 1;
        this.xlMax = 1399;

        this.xxlMin = this.xlMax + 1;
        this.xxlMax = 9999;

        this.breakpoints = {
            xs: {
                min: this.xsMin,
                max: this.xsMax
            },
            sm: {
                min: this.smMin,
                max: this.smMax
            },
            md: {
                min: this.mdMin,
                max: this.mdMax
            },
            lg: {
                min: this.lgMin,
                max: this.lgMax
            },
            xl: {
                min: this.xlMin,
                max: this.xlMax
            },
            xxl: {
                min: this.xxlMin,
                max: this.xxlMax
            }
        }

    }

    __breakpointExists(breakpoint) {
        let exists = this.breakpoints.hasOwnProperty(breakpoint);
        if (!exists) {
            console.error('Breakpoint', breakpoint, 'does not exist.');
        }
        return exists;
    }

    getBreakpoints() {
        return this.breakpoints;
    }

    getBreakpoint(breakpoint) {
        if (this.__breakpointExists(breakpoint)) {
            return this.breakpoints[breakpoint];
        }
        return {};
    }

    getMin(breakpoint) {
        if (this.__breakpointExists(breakpoint)) {
            return this.breakpoints[breakpoint].min
        }
        return {};
    }

    getMax(breakpoint) {
        if (this.__breakpointExists(breakpoint)) {
            return this.breakpoints[breakpoint].max
        }
        return {};
    }

    getCurrentBreakpointName() {
        if (this.isXS()) {
            return 'xs';
        } else if (this.isSM()) {
            return 'sm';
        } else if (this.isMD()) {
            return 'md';
        } else if (this.isLG()) {
            return 'lg';
        } else if (this.isXL()) {
            return 'xl';
        } else if (this.isXXL()){
            return 'xxl';
        } else {
            return 'xl'
        }
    }

    __isThisBreakpoint(breakpoint) {
        let w = window.innerWidth;
        return w >= this.breakpoints[breakpoint].min &&
            w <= this.breakpoints[breakpoint].max;
    }

    isXS() {
        return this.__isThisBreakpoint('xs');
    }

    isSM() {
        return this.__isThisBreakpoint('sm');
    }

    isMD() {
        return this.__isThisBreakpoint('md');
    }

    isLG() {
        return this.__isThisBreakpoint('lg');
    }

    isXL() {
        return this.__isThisBreakpoint('xl');
    }

    isXXL() {
        return this.__isThisBreakpoint('xxl');
    }

    // alternative method
    getBootstrapSize(){
        return this.getCurrentBreakpointName();
    }

}

export function BreakpointService() {
    return new JVBreakpoints();
}
